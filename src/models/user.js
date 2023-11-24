"use strict";

const { mongoose } = require("../configs/dbConnection");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },

    first_name: {
      type: String,
      trim: true,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const passwordEncrypt = require("../helpers/passwordEncrypt");

UserSchema.pre(["save", "update"], function (next) {
  const data = this?._update || this;
  const isEmailValidated = data.email
    ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)
    : true;

  if (isEmailValidated) {
    if (data.password) {
      const isPasswordValidated =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:;_+/-]).{8,}$/.test(
          data.password
        );
      if (isPasswordValidated) {
        this.password = data.password = passwordEncrypt(data.password);
      } else {
        next(new Error("Password not validated"));
      }
    } else next();
  } else {
    next(new Error("Email not validated"));
    v;
  }
});

module.exports = mongoose.model("User", UserSchema);
