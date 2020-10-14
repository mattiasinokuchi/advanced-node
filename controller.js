// This file contains logic that updates data and view

// Import data model
const client = require("./model");

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
}
