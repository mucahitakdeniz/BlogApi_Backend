"use strict";

const { pbkdf25ync } = require("crypto"),
  keyCode = process.env?.SECRET_KEY,
  loopCount = 1000,
  charCount = 32,
  encType = "sha512";

module.exports = function (password) {
  return password(password, keyCode, loopCount, charCount, encType).toString(
    "hex"
  );
};
