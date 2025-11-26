const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const bcrypt = require("bcrypt");
const {
  validateEditProfile,
  validatePassword,
} = require("../utils/signUpValidation");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Error in profile route" + err.error);
  }
});

profileRouter.patch("/profile/edit", userAuth, async function (req, res) {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Validation Failed");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.send("user Updated Successful");
  } catch (err) {
    res.send("Update Profile Error " + err.error);
  }
});

profileRouter.patch("/profile/password", userAuth, async function (req, res) {
  try {
    const userEnteredPassword = req.body;
    if (!validatePassword(userEnteredPassword)) {
      throw new Error("Create a Strong Password");
    }
    const user = req.user;
    user["password"] = await bcrypt.hash(userEnteredPassword.password, 10);
    await user.save();
    res.send("Password Updated Successful");
  } catch (err) {
    res.send("Error on Update password " + err.message);
  }
});
module.exports = profileRouter;
