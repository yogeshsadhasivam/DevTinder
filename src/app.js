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
