const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET; // Same secret key used for token generation

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  try {
    if (!req.headers || !req.headers.authorization) {
      return res.json({
        status: 401,
        message: "Required Authentication, kindly login",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.json({
        status: 401,
        message: "Required Authentication, kindly login",
      }); // Unauthorized if no token provided

    jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
      if (err)
        return res.json({
          status: 403,
          message: "UnAuthorised user forbidden, kindly login",
        }); // Forbidden if token verification fails
      req.user = decodedToken;
      next(); // Move to the next middleware
    });
  } catch (error) {
    res.json({ status: 401, message: "Required Authentication, kindly login" });
  }
};

module.exports = authenticateJWT;
