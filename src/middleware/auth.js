const jwt = require("jsonwebtoken");
const User = require("../model/user");
const userAuth = async function (req, res, next) {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.send("Invalid Token");
    }
    const decoded = await jwt.verify(token, "Chitra@24");
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.send("User Not Found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(err.error);
  }
};

module.exports = { userAuth };
