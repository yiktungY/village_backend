const express = require("express");
const router = express.Router();
const passport = require("passport");
const knex = require("knex")(require("../knexfile.js").production);

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

router.push("/newlogin", (req, res) => {
  knex("users")
    .select("id")
    .where({ google_id: profile.id })
    .then((user) => {
      if (user.length) {
        console.log(user, "found the users and successfully login");
        // If user is found, pass the user object to serialize function
        done(null, user[0]);
      } else {
        // If user isn't found, we create a record
        console.log("cannot find id, insert to knex table");
        knex("users")
          .insert({
            google_id: profile.id,
            email: profile.email,
            avatar_url: profile.picture,
            displayName: profile.displayName,
            givenName: profile.given_name,
            familyName: profile.family_name,
          })
          .then((user) => {
            console.log(user, "user");
            // Pass the user object to serialize function
            done(null, user[0]);
          })
          .catch((err) => {
            console.log("Error creating a user", err);
          });
      }
    })
    .catch((err) => {
      console.log("Error fetching a user", err);
    });
});

module.exports = router;
