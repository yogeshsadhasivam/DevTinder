require("dotenv").config();
const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookie = require("cookie-parser");
const PORT = 3000;
app.use(express.json());
app.use(cookie());
const authRouter = require("./router/authRouter.js");
const profileRouter = require("./router/profileRouter.js");
const connectionRouter = require("./router/connectionRouter.js");
const userRouter = require("./router/userRouter.js");

app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);

connectDB()
  .then(() => {
    console.log("Database Connection");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Database not Connected");
  });

//It will handle only GET requests that come to /test route
app.get("/test", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    serverTime: new Date().now(),
    version: "1.0.0",
  });
});
/*
app.post("/test/:userId/:userName", (req, res) => {
  res.send("This is a POST request test route");
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  res.send(req.user.firstName + " Connection Request Sending");
});

app.delete("/test", (req, res) => {
  res.send("This is a DELETE request test route");
});*/

//It will handle all the requests that come to /test route
//We can able to make multiple callbacks
//For one Route we can able to use multiple route handlers
// GET /user route => middleware chain => request handler
/*app.use(
  "/helloworld",
  (req, res, next) => {
    res.send("This is a helloworld route");
    next();
  },
  (req, res, next) => {
    console.log("This is second callback");
    next();
  },
  (req, res) => {
    res.send("This is a helloworld route");
    console.log("This is third callback");
  }
);*/

/*
app.delete("/logout", async (req, res) => {
  try {
    const deleteUser = await User.findOneAndDelete({ email: req.body.email });
    res.send("User Deleted Successfully" + deleteUser);
  } catch (err) {
    res.status(500).send("User not Deleted Successfully");
  }
});*/
