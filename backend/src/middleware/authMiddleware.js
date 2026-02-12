const jwt = require("jsonwebtoken");
const User = require("../models/users");

const isLoggedin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const token = authorization.split(" ")[1];

    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    
    const user = await User.findById(decoded.userId).select("-password");

    console.log(user);
    


    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

module.exports = isLoggedin;
