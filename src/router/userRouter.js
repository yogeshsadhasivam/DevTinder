const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const Connection = require("../model/connections.js");
const SAFE_ATTRIBUTES = "firstName lastName age";

userRouter.get(
  "/request/received/pending",
  userAuth,
  async function (req, res) {
    try {
      const loggedInUser = req.user;
      const receivedRequest = await Connection.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId", SAFE_ATTRIBUTES);

      const data = receivedRequest.map((row) => row.fromUserId);
      res.status(200).json({ data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

userRouter.get(
  "/request/receive/accepted",
  userAuth,
  async function (req, res) {
    try {
      const loggedInUser = req.user;
      const acceptedUser = await Connection.find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
        .populate("fromUserId", SAFE_ATTRIBUTES)
        .populate("toUserId", SAFE_ATTRIBUTES);
      const data = acceptedUser.map((row) => {
        if (row.fromUserId._id.toString() != loggedInUser._id.toString()) {
          return row.fromUserId;
        }
        return row.toUserId;
      });
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

module.exports = userRouter;
