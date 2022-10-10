const knex = require("knex")(require("../knexfile.js").development);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!(email && password && username)) {
      console.log({ error: "Data not formatted properly" });
      return res.status(400).send({ error: "Data not formatted properly" });
    }
    const isEmailReg = await knex("users").where({ email: email }).first()
    if (isEmailReg) {
      console.log({ error: "This email has already been registered!" })
      return res.status(401).json({
        error: "This email has already been registered!",
      })
    }
    const isUserNameReg = await knex("users").where({ displayName: username }).first()
    if (isUserNameReg) {
      console.log({ error: "This username has already been used!" })
      return res.status(401).json({
        error: "This username has already been used!",
      })
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
    return res.status(200).json({ user, token });
  }
  catch (err) {
    if (err) {
      res.status(401).send("user already exists")
    } else {
      next(err)
    }
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await knex("users").where({ email: email }).first()
    if (!user) {
      console.log({ error: "No user by that email" });
      return res.status(401).json({
        error: "No user by that email",
      })
    }
    const isAuthenticated = await bcrypt.compare(password, user.password)
    if (!isAuthenticated) {
      console.log({ error: "Wrong username and/or password" });
      return res.status(401).json({ error: "Wrong email and/or password" });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET,
        { expiresIn: 86400 });
      return res.status(200).json({ user, token });
    }
  } catch (error) {
    next(error)
  }
}

const getUser = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      knex("users").where({ id: decoded.id }).first()
        .then((user) => {
          return res.status(200).json({ user });
        });
    });
  } else {
    next("cannot get user")
  }
}

const logout = (req, res, next) => {
  res.sendStatus(204);
}

module.exports = {
  signUp,
  login,
  getUser,
  logout
}
