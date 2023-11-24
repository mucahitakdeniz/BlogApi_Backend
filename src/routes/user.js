"use strict";

const router = require("express").Router();
const user = require("../controllers/user");

router.route("/").get(user.list).post(user.create);

router
  .route("/:id")
  .get(user.read)
  .post(user.update)
  .put(user.update)
  .delete(user.delete);
  
module.exports = router;
