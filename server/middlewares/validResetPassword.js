const { isJwtIdUsed } = require("../controllers/auth.controller");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const validResetPassword = async (req, res, next) => {
  const decoded = jwt.verify(req.body.accessToken, process.env.SECRET_KEY);
  const { id, reset, jti } = decoded;
  try {
    if (!reset) {
      return res.status(400).json(new Status(400, "Bad request", ""));
    }
    const user = await User.findById(id);
    if (user) {
      const check = await isJwtIdUsed(jti, user._id);
      if (check == true) {
        return next();
      } else {
        return res.status(404).json(new Status(404, "Fail", ""));
      }
    } else {
      return res.status(404).json(new Status(404, "User not found", ""));
    }
  } catch (error) {
    return res.status(500).send("Something went wrong. Please try again");
  }
};
module.exports = validResetPassword;
