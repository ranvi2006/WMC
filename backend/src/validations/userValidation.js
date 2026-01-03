const { body } = require("express-validator");

exports.registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be 10 digits"),

  body("role")
    .optional()
    .isIn(["student", "teacher", "admin"])
    .withMessage("Invalid role")
];


exports.loginValidation = [
  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  body().custom((value) => {
    if (!value.email && !value.phone) {
      throw new Error("Email or phone is required");
    }
    return true;
  })
];
