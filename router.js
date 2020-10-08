// This file forwards requests to handlers in the controller-file

// Mount web app framework
const express = require('express');

// Create a new router object
const router = express.Router();

// Import controller
const controller = require('./controller');

// Define router
router.get("/", controller.home);
router.post('/login', passport.authenticate('local', { failureRedirect: '/' }), controller.login);
router.get('/profile', ensureAuthenticated, controller.profile);
router.get('/logout', controller.logout);
router.post('/register', controller.register);

// Make routes available from server.js
module.exports = router;
