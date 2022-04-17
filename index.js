const express = require("express");

// Middleware for creating a session id on server and a session cookie on client
const expressSession = require("express-session");

// cors package prevents CORS errors when using client side API calls
const cors = require("cors");

// Add http headers, small layer of security
const helmet = require("helmet");

// Passport library and Github Strategy
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;

// Knex instance
const knex = require("knex")(require("./knexfile.js").development);

// Create Express app and also allow for app PORT to be optionally specified by an environment variable
const app = express();
const PORT = process.env.PORT || 8080;

// Require .env files for environment variables (keys and secrets)
require("dotenv").config();

// Enable req.body middleware
app.use(express.json());

// Initialize HTTP Headers middleware
app.use(helmet());

// Enable CORS (with additional config options required for cookies)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Include express-session middleware (with additional config options required for Passport session)
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    function (_request, _accessToken, _refreshToken, profile, done) {
      // console.log("GOOGLE profile:", profile);
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
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser (user object):", user);

  // Store only the user id in session
  done(null, user.id);
});

// `deserializeUser` receives a value sent from `serializeUser` `done` function
// We can then retrieve full user information from our database using the userId
passport.deserializeUser((userId, done) => {
  console.log("deserializeUser (user id):", userId);

  // Query user information from the database for currently authenticated user
  knex("users")
    .where({ id: userId })
    .then((user) => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      // console.log("req.user:", user[0]);

      // The full user object will be attached to request object as `req.user`
      done(null, user[0]);
    })
    .catch((err) => {
      console.log("Error finding user", err);
    });
});

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/posts");
const applyRoutes = require("./routes/apply");

app.get("/", (req, res) => {
  res.send("WELCOME");
});

//routes
app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/posts", postsRoutes);

app.use("/apply", applyRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}.`);
});
