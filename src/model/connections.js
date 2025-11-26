const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const connectionSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

connectionSchema.index({ fromUserId: 1, toUserId: 1 });

connectionSchema.pre("save", function (next) {
  try {
    const currentObject = this;
    if (
      currentObject.fromUserId.toString() == currentObject.toUserId.toString()
    ) {
      throw new Error("Connot able to connect Yourself");
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Connection", connectionSchema);
