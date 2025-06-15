const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const UserSchemaValidate = Joi.object({
  roleId: Joi.required(),
  name: Joi.string().required().min(3).messages({
    "string.base": `name must be a type of text`,
    "any.required": `name is required`,
    "string.min": `minimum 3 characters required`,
  }),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } }),
  phone: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .regex(/[A-Z]/) // Ensure at least one uppercase letter
    .regex(/[\W_]/) // Ensure at least one special character
    .required()
    .messages({
      "string.base": "Password should be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter and one special character.",
      "any.required": "Password is required.",
    }),
  profile_pic: Joi.string().required(),
});

const UserSchema = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "role",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: 0,
  }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel, UserSchemaValidate };
