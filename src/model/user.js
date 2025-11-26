const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      validate: {
        validator: (value) => {
          const allowedGenders = ["male", "female", "other"];
          return allowedGenders.includes(value.toLowerCase());
        },
      },
    },
    photourl: {
      type: String,
      default:
        "https://www.google.com/imgres?q=photos&imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1497316730643-415fac54a2af%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFraW5nJTIwcGhvdG98ZW58MHx8MHx8fDA%253D&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Ftaking-photo&docid=qPJErPdu1mfMVM&tbnid=w35tLr9kd-hn3M&vet=12ahUKEwiViIG__vWQAxXxyzgGHZubOP4QM3oECBUQAA..i&w=3000&h=3750&hcb=2&ved=2ahUKEwiViIG__vWQAxXxyzgGHZubOP4QM3oECBUQAA",
      validate: {
        validator: (value) => {
          return validator.isURL(value);
        },
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Chitra@24", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByInput) {
  const user = this;
  return await bcrypt.compare(passwordByInput, user.password);
};


module.exports = mongoose.model("User", userSchema);