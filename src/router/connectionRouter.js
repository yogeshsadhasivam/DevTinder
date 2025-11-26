const express = require("express");
const connectionRouter = express.Router();
const Connection = require("../model/connections.js");
const { userAuth } = require("../middleware/auth.js");
const User = require("../model/user");

connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async function (req, res) {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const toUserId = req.params.toUserId;
      const fromUserId = loggedInUser._id;
      if (!["interested", "ignored"].includes(status)) {
        throw new Error("The status must be interested or ignored");
      }
      // findById() returns a Promise — make sure to await it so we get the
      // user document (or null) instead of a Promise object.
      const isUserExist = await User.findById(toUserId);
      if (!isUserExist) {
        throw new Error("No User Found");
      }

      const isConnectionExist = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isConnectionExist) {
        throw new Error("The Connection is already Exist");
      }
      const connection = new Connection({ fromUserId, toUserId, status });
      await connection.save();
      res.status(200).json({
        message: `${loggedInUser.firstName} is ${status} in ${isUserExist.firstName} `,
        data: connection,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

connectionRouter.post(
  "/request/receive/:status/:requestId",
  userAuth,
  async function (req, res) {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      if (!["accepted", "rejected"].includes(status)) {
        res.status(400).json({ message: `${status} is invalid` });
      }

      const connectionRequest = await Connection.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: `Connection request not found` });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      return res
        .status(200)
        .json({ message: `Connection Send Successfull`, status, data });
    } catch (error) {
      res.status(400).json({ message: `Connection Receive Failed`, error });
    }
  }
);

module.exports = connectionRouter;
