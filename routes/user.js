const express = require("express");
const router = require("express").Router();
const userController = require("../controllers/userController");

router.route("/").get(userController.getAllUser);

router
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUserProfile);

router
.route("/posts/:id").get(userController.getAllPostbyUserId)

module.exports = router;
