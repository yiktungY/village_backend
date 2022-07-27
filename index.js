const express = require("express");

// Middleware for creating a session id on server and a session cookie on client
const expressSession = require("express-session");

// cors package prevents CORS errors when using client side API calls
const cors = require("cors");

// Add http headers, small layer of security
const helmet = require("helmet");

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

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/posts");
const applyRoutes = require("./routes/apply");

app.get("/", (req, res) => {
  res.send("WELCOME");
});

app.use("/auth", authRoutes)
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);
app.use("/apply", applyRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}.`);
});
