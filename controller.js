// This file contains logic that updates data and view

// Import data model
const client = require("./model");

// Make handlers available from routes.js
module.exports = {
  // Handler for request to home page
  home: (req, res) => {
    console.log("/");
    res.render('pug', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true
    });
  },
}
