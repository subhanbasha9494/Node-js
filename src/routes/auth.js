const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //Creating a new instance of the User model
    const user = new User({ firstName, lastName, emailId, password: passwordHash });
    await user.save();
    res.send("User Added Succesfully");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message)
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentails");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "mysecret", { expiresIn: "1h" });
      res.cookie("token", token);
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentails");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message)
  }
})

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfull");
})


module.exports = authRouter;