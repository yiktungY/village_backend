const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController")

router.route("/signup").post(authController.signUp)

router.route("/login").post(authController.login)

router.route("/user").get(authController.getUser)

router.route("/logout").delete(authController.logout)

module.exports = router;