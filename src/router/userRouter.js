const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const Connection = require("../model/connections.js");
const SAFE_ATTRIBUTES = "firstName lastName age";
const User = require("../model/user.js");

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

userRouter.get("/feed", userAuth, async function (req, res) {
  try {
    const loggedInUser = req.user;
    const existingConnections = await Connection.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });
    // Build a set of user ids to exclude (users the logged-in user already
    // has connections with). Ensure we store string ids so $nin matching works
    // with Mongoose if there are mixed ObjectId/string values.
    const hideUser = new Set();
    existingConnections.forEach((connection) => {
      hideUser.add(String(connection.fromUserId));
      hideUser.add(String(connection.toUserId));
    });

    hideUser.add(String(loggedInUser._id));

    const hiddenUser = await User.find({ _id: { $nin: Array.from(hideUser) } }).select(SAFE_ATTRIBUTES);

    return res.status(200).json({ data: hiddenUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
module.exports = userRouter;
