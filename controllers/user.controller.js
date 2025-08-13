const axios = require("axios");
const db = require("../config/db");
const { hashToPlain, plainToHash } = require("../utils/password");

exports.getUserRegisterLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT latitude, longitude FROM users WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { latitude, longitude } = rows[0];

    const apiKey = "d574691caf434ec4b6ed9f72634b613e";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    const { data } = await axios.get(url);

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    const formatted = data.results[0].formatted;

    const components = data.results[0].components;

    res.status(200).json({
      message: "Location fetched successfully",
      latitude,
      longitude,
      location: formatted,
      city: components.county || components.town || components.village || "",
      state: components.state || "",
      country: components.country || "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.findNearbyUsersLive = async (req, res) => {
  const { myLat, myLon } = req.query;

  if (!myLat || !myLon) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required" });
  }

  try {
   const [rows] = await db.query(
  `SELECT
    u.id,
    u.email,
    u.latitude,
    u.longitude,
    GetDistanceKm(?, ?, u.latitude, u.longitude) AS distance_km
FROM users u
HAVING distance_km <= 150
ORDER BY distance_km ASC`,
  [myLat, myLon]
);
    res.status(200).json({
      message: `Users within 15km of your location`,
      nearbyUsers: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    const user_id = req.user.id;
    let profile_img = null;

    if (req.file) {
      profile_img = req.file.path;
    }

    const [result] = await db.query(
      `UPDATE users 
       SET first_name = ?, last_name = ?, profile_img = COALESCE(?, profile_img) 
       WHERE id = ?`,
      [first_name, last_name, profile_img, user_id]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.change_password = async (req, res) => {
  console.log(req.body);
  const { old_pass, new_pass } = req.body;
  const user_id = req.user.id
  try {
    const [user] = await db.query(`select * from users WHERE id = ?`,[user_id])
    const password = user[0].password

    const checkPass = await hashToPlain(old_pass,password)
    console.log(checkPass)
    if(!checkPass){
         res.status(401).json({ error: "password not match" });
    }
    const hashPassword = await plainToHash(new_pass)

    await db.query(`update users set password = ? where id = ?`,[hashPassword,user_id])

    res.json({ message: "Password change successfully" });

    res.json(user)
    
  } catch (err) {
     console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
