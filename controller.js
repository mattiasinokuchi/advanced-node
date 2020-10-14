// This file contains logic that updates data and view

// Import module for hashing password
const bcrypt = require('bcrypt');

// Import data model
const Users = require("./model");

// Make handlers available from routes.js
module.exports = {

  // Route handler for request to home page
  home: (req, res) => {
    console.log("/");
    res.render('pug', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true
    });
  },

  // Route handler for request to login
  login: (req, res) => {
    console.log("/login =>");
    res.redirect('/profile');
  },

  // Route handler for request to profile page
  profile: (req, res) => {
    console.log("/profile");
    res.render('pug/profile', {
      username: req.user.username
    });
  },

  // Route handler for request to logout
  logout: (req, res) => {
    console.log("/logout =>");
    req.logout();
    res.redirect('/');
  },

  // Route handler for request to register and then login...
  register: async(req, res, next) => {
    try {
      //...salts and hashes the password...
      const hash = bcrypt.hashSync(req.body.password, 12);
      // ...searches for the username in the database...
      const user = await Users.findOne({ username: req.body.username });
      if (user) {
        // ...redirects back if username already is taken...
        res.redirect('/');
      } else {
        // ...or inserts the username with the salted and hashed password...
        const doc = await Users.create({ username: req.body.username, password: hash });
        // ...then passes user object to passport.authenticate...
        next(null, doc[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
