"use strict";

const category = require("../controllers/category");

const router = require("express").Router();
const { isAdmin } = require("../middlewares/permissions");

router.use(isAdmin);
router.route("/").get(category.list).post(category.create);
router
  .route("/:id")
  .get(category.read)
  .patch(category.update)
  .put(category.update)
  .delete(category.delete);

module.exports = router;
