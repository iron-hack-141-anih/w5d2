const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!password || !username) {
    res.render("auth/signup", { errorMessage: "Both fields are required" });

    return;
  } else if (password.length < 8) {
    res.render("auth/signup", {
      errorMessage: "Password needs to be 8 characters min"
    });

    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "This username is already taken"
        });

        return;
      }
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      return User.create({
        username,
        password: hash
      }).then(data => {
        res.redirect("/");
      });
    })
    .catch(err => {
      res.render("views/signup", { errorMessage: err._message });
    });
});

module.exports = router;
