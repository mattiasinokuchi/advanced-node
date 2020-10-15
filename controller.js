// This file contains logic that updates data and view

// Import module for encryption of password
const bcrypt = require('bcrypt');

// Import data model
const Users = require("./model");

// Make handlers available from router.js
module.exports = {

  // Route handler for request to home page
  home: (req, res) => {
    console.log("=> /");
    res.render('pug', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true
    });
  },

  // Route handler for request to login
  login: (req, res) => {
    console.log("=> /login =>");
    res.redirect('/profile');
  },

  // Route handler for request to profile page...
  profile: async (req, res) => {
    console.log("=> /profile");
    if (req.isAuthenticated()) {
      // ...render the page...
      res.render('pug/profile', {
        username: req.user.username
      });
    } else {
      // ...or redirects unauthenticated requests to home page
      console.log("unauthenticated request to profile page");
      res.redirect('/');
    }
  },

  // Route handler for request to logout...
  logout: (req, res) => {
    console.log("/logout =>");
    // ...removes the req.user property (clears login session)...
    req.logout();
    // ...and redirects to the home page
    res.redirect('/');
  },

  // Route handler for request to register and then login...
  register: async(req, res, next) => {
    console.log("/register =>");
    try {
      //...encrypts the password...
      const hash = bcrypt.hashSync(req.body.password, 12);
      // ...searches for the username in the database...
      const user = await Users.findOne({ username: req.body.username });
      if (user) {
        console.log("=> username already exists =>");
        // ...redirects home if username is occupied...
        res.redirect('/');
      } else {
        // ...or adds username and encrypted password in the database...
        const doc = await Users.create({ username: req.body.username, password: hash });
        // ...then passes user object to passport.authenticate
        next(null, doc[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
