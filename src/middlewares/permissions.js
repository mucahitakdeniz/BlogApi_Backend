"use strict";

module.exports = {
  isLogin: (req, res, next) => {
    if (req.user && req.user.is_active) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("No Permission : You must Login");
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user && req.user.is_admin) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("No Permission : You must Admin");
    }
  }
};
