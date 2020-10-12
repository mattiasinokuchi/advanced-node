// This file forwards requests to handlers in the controller-file

// Mount web app framework
const express = require('express');

// Import authentication middleware
const passport = require('passport');

// Create a new router object
const router = express.Router();

// Import controller
const controller = require('./controller');

// Define router
router.get("/", controller.home);
router.post("/login", passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  // ...then redirects to profile page through ensureAuthenticated if successful
  res.redirect('/profile');
});

// Route for request to login passes user through passport.use...
/*app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  // ...then redirects to profile page through ensureAuthenticated if successful
  res.redirect('/profile');
});*/

// Make routes available from server.js
module.exports = router;
