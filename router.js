// This file forwards requests to handlers in the controller-file

// Mount web app framework
const express = require('express');

// Create a new router object
const router = express.Router();

// Import controller
const controller = require('./controller');

// Define router
router.get("/", controller.home);

// Make routes available from server.js
module.exports = router;
