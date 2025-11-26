const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const { validateSignUpData } = require("../utils/signUpValidation");
const bcrypt = require("bcrypt");
authRouter.patch("/updateuser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (["email"].includes(Object.keys(req.body)[0])) {
      res.status(400).send("Cannot update email");
      throw new Error("Cannot update email");
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.send("User Updated Successfully");
  } catch (err) {
    res.send("User not Updated Successfully" + err.message);
  }
});

authRouter.get("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordMatch = await user.validatePassword(req.body.password);
    if (isPasswordMatch) {
      const token = await user.getJWT();  
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    res.status(500).send("Error in fetching users", error.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const validateSignUp = validateSignUpData(req.body);
    if (!validateSignUp.valid) {
      return res.status(400).send(validateSignUp.message);
    }

    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    req.body.password = hashedPassword;
    const user = new User(req.body);

    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.send("User not  signed up successfully" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("User Logged Out SuccessFull");
});

module.exports = authRouter;
