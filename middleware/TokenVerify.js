const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      res.json({
        message: "token not found",
      });
    }
    token = token.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.SECRET_TOKEN);
    // console.log(verifyToken)
    if (verifyToken) {
      req.user = verifyToken;
      next();
    } else {
      res.json({
        error: true,
        message: "token not verify",
      });
    }
  } catch (error) {
    console.log("error: ", error);
  }
};

