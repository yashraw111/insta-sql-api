const { plainToHash, hashToPlain } = require("../utils/password");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  console.log(req.body);
  const { email, password, latitude, longitude } = req.body;

  if (!email || !password || !latitude || !longitude) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (result.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashPass = await plainToHash(password);
    const [insertResult] = await db.query(
      "INSERT INTO users (email, password, latitude, longitude) VALUES (?, ?, ?, ?)",
      [email, hashPass, latitude, longitude]
    );

    res.status(201).json({
      message: "User registered successfully",
      id: insertResult.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password, latitude, longitude } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (result.length === 0) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const user = result[0];
    const isMatch = await hashToPlain(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // // Insert into login_logs (trigger will work here)
    // await db.query(
    //   "INSERT INTO login_logs (user_id, latitude, longitude) VALUES (?, ?, ?)",
    //   [user.id, latitude, longitude]
    // );
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.SECRET_TOKEN);

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      payload,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { register, login };
