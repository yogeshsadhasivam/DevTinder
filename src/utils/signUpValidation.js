const validator = require("validator");

function validateSignUpData(data) {
  if (data.firstName.length < 2 || data.firstName.length > 30) {
    return {
      valid: false,
      message: "First name must be between 2 and 30 characters.",
    };
  } else if (!validator.isStrongPassword(data.password)) {
    return { valid: false, message: "Password is not strong enough." };
  } else if (!validator.isEmail(data.email)) {
    return { valid: false, message: "Invalid email format." };
  }
  return { valid: true };
}

function validateEditProfile(req) {
  const allowEditableKey = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "photourl",
  ];

  const isValidProfile = Object.keys(req.body).every((key) => {
    return allowEditableKey.includes(key);
  });
  return isValidProfile;
}
function validatePassword(data) {
  const isValidPassword = Object.keys(data).every((key) => {
    return ["password"].includes(key);
  });
  return isValidPassword ? validator.isStrongPassword(data.password) : false;
}

module.exports = { validateSignUpData, validateEditProfile, validatePassword };
