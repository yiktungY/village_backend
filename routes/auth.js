const { constants } = require("buffer");
const express = require("express");
const router = express.Router();
const passport = require("passport");

require("dotenv").config();

router.get(
  "/google",

  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/registerSuccee`,
  }),
  (req, res) => {
    console.log("req.user", req.user.id);
    // Successful authentication, redirect to client-side application
    res.redirect(`${process.env.CLIENT_URL}/profile/${req.user.id}`);
  }
);

router.get("/profile", (req, res) => {

  if (req.user === undefined)
    return res.status(401).json({ message: "Unauthorized" });

  res.status(200).json(req.user);
});

// Create a logout endpoint
router.get("/logout", (req, res) => {
  req.logout();

  res.redirect(process.env.CLIENT_URL);
});

router.get("/success-callback", (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
});

module.exports = router;
