// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const knex = require("knex")(require("../knexfile.js").development);

// require("dotenv").config();

// router.get(
//   "/google",

//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//   })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: `${process.env.CLIENT_URL}/registerSuccee`,
//   }),
//   (req, res) => {
//     console.log("req.user", req.user.id);
//     // Successful authentication, redirect to client-side application
//     res.redirect(`${process.env.CLIENT_URL}/profile/${req.user.id}`);
//   }
// );

// router.get("/profile", (req, res) => {
//   if (req.user === undefined)
//     return res.status(401).json({ message: "Unauthorized" });

//   res.status(200).json(req.user);
// });

// // Create a logout endpoint
// router.get("/logout", (req, res) => {
//   req.logout();

//   res.redirect(process.env.CLIENT_URL);
// });

// router.get("/success-callback", (req, res) => {
//   if (req.user) {
//     res.status(200).json(req.user);
//   } else {
//     res.status(401).json({ message: "User is not logged in" });
//   }
// });

// router.post("/newlogin", (req, res) => {
//   console.log("req", req.body);
//   knex("users")
//     .insert({
//       google_id: req.body.google_id,
//       email: req.body.email,
//       avatar_url:
//         "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2F124465293-56a001375f9b58eba4ae696f.jpeg?alt=media&token=9070e549-4adb-4356-a141-41119dbdfaa9",
//       displayName: req.body.displayName,
//     })
//     .then((user) => {
//       // console.log(user, "user");
//       // Pass the user object to serialize function
//     })
//     .catch((err) => {
//       console.log("Error creating a user", err);
//     });
// });

// module.exports = router;
