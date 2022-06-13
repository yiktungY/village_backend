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

// // Knex instance
const knex = require("knex")(require("./knexfile.js").production);
const jwt = require("jsonwebtoken");
// // Create Express app and also allow for app PORT to be optionally specified by an environment variable
const app = express();
const PORT = process.env.PORT || 8080;

// // Require .env files for environment variables (keys and secrets)
require("dotenv").config();

// // Enable req.body middleware
app.use(express.json());

// // Initialize HTTP Headers middleware
app.use(helmet());

// // Enable CORS (with additional config options required for cookies)
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

//normal oauth
// function authorize(req, res, next) {
//   if (!req.headers.authorization) {
//     return res.status(401).json({
//       error: {
//         message: "ERROR MESSAGE",
//       },
//     });
//   }
//   const authTokenArray = req.headers.authorization.split(" ");
//   if (
//     authTokenArray[0].toLowerCase() !== "bearer && authTokenArray.length !==2"
//   ) {
//     return res.status(401).json({
//       error: {
//         message: "ERROR MESSAGE",
//       },
//     });
//   }
//   jwt.verify(authTokenArray[1], process.env.mykey, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "no" });
//     } else {
//       req.jwtPayload = decoded;
//       next();
//     }
//   });
// }
const bcrypt = require("bcrypt");

app.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!(email && password && username)) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }
    const hash = await bcrypt.hash(password, 10)
    await knex("users").insert({
      email: email,
      password: hash,
      avatar_url:
        "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2Fsmiling-face.png?alt=media&token=792d8aa7-4d33-4092-86ec-b8c04b58b658",
      displayName: username,
    })
    const user = await knex("users").where({ email: email }).first()
    let token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, { expiresIn: 86400 });
    return res.json({ user, token });
  }

  // bcrypt.hash(password, 10).then((hashedPassword) => {
  //   knex("users")
  //     .insert({
  //       email: email,
  //       password: hashedPassword,
  //       avatar_url:
  //         "https://firebasestorage.googleapis.com/v0/b/village-345022.appspot.com/o/files%2Fsmiling-face.png?alt=media&token=792d8aa7-4d33-4092-86ec-b8c04b58b658",
  //       displayName: username,
  //     })
  //   .then((user) => {
  // console.log("user", user);
  // let token = jwt.sign({ email: email }, "secretkey");
  // return res.json({ user, token });
  // })
  catch (err) {
    if (err) {
      res.status(401).send("user already exists")
    } else {
      next(err)
    }
  }
});


app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await knex("users").where({ email: email }).first()
    const isAuthenticated = await bcrypt.compare(password, user.password)
    if (!user) {
      console.log({ error: "No user by that email" });
      res.status(401).json({
        error: "Wrong email and/or password",
      });
    } else if (!isAuthenticated) {
      console.log({ error: "Wrong username and/or password" });
      res.status(401).json({ error: "Wrong email and/or password" });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET,
        { expiresIn: 86400 });
      return res.json({ user, token });
    }
  } catch (error) {
    next(error)
  }
});

app.get("/user", (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      knex("users").where({ id: decoded.id }).first()
        .then((user) => {
          return res.json({ user });
        });
    });
  } else {
    next(error)
  }

});

app.delete("/logout", (req, res, next) => {
  res.sendStatus(204);
});

// app.post("/login", (req, res, next) => {
//   const { email, password } = req.body;
//   knex("users")
//     .where({ email: email })
//     .first()
//     .then(user => {
//       if (!user) {
//         res.status(401).json({ error: "No user by that name" });
//       } else {
//         return bcrypt.compare(password, user.passport).then(isAuthenticated => {
//           if(!isAuthenticated){
//             res.status(401).json({error: "Unauthorized Access!"})
//           })else{
//             return jwt.sign(user, process.env.SESSION_SECRET, (error. token) => {
//               res.status(200).json({token})
//             })
//           }
//         })})

// knex("users")
//   .where({ email: email })
//   .then((user) => {
//     if (user[0].password === password) {
//       let token = jwt.sign({ email: email }, "secretkey");
//       res.json({ token: token, id: user[0].id });
//     } else {
//       res.status(403).send({ token: null });
//     }
//   });

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//       passReqToCallback: true,
//     },
//     function (_request, _accessToken, _refreshToken, profile, done) {
//       // console.log("GOOGLE profile:", profile);
//       knex("users")
//         .select("id")
//         .where({ google_id: profile.id })
//         .then((user) => {
//           if (user.length) {
//             console.log(user, "found the users and successfully login");
//             // If user is found, pass the user object to serialize function
//             done(null, user[0]);
//           } else {
//             // If user isn't found, we create a record
//             console.log("cannot find id, insert to knex table");
//             knex("users")
//               .insert({
//                 google_id: profile.id,
//                 email: profile.email,
//                 avatar_url: profile.picture,
//                 displayName: profile.displayName,
//                 givenName: profile.given_name,
//                 familyName: profile.family_name,
//               })
//               .then((user) => {
//                 console.log(user, "user");
//                 // Pass the user object to serialize function
//                 done(null, user[0]);
//               })
//               .catch((err) => {
//                 console.log("Error creating a user", err);
//               });
//           }
//         })
//         .catch((err) => {
//           console.log("Error fetching a user", err);
//         });
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   console.log("serializeUser (user object):", user);

//   // Store only the user id in session
//   done(null, user.id);
// });

// // `deserializeUser` receives a value sent from `serializeUser` `done` function
// // We can then retrieve full user information from our database using the userId
// passport.deserializeUser((userId, done) => {
//   console.log("deserializeUser (user id):", userId);

//   // Query user information from the database for currently authenticated user
//   knex("users")
//     .where({ id: userId })
//     .then((user) => {
//       // Remember that knex will return an array of records, so we need to get a single record from it
//       // console.log("req.user:", user[0]);

//       // The full user object will be attached to request object as `req.user`
//       done(null, user[0]);
//     })
//     .catch((err) => {
//       console.log("Error finding user", err);
//     });
// });

// const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/posts");
const applyRoutes = require("./routes/apply");

app.get("/", (req, res) => {
  res.send("WELCOME");
});

//routes
// app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/posts", postsRoutes);

app.use("/apply", applyRoutes);

// app.use(function (req, res, next) {
//   const token = req.headers["x-access-token"];
//   if (token) {
//     jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
//       if (err) {
//         return next();
//       }
//       knex("users").where({ id: decoded.id }).first()
//         .then((user) => {
//           req.user = user;
//           return next();
//         });
//     });
//   } else {
//     return next();
//   }
// });


app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}.`);
});
