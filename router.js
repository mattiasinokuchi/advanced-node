// Import authentication middleware
const passport = require('passport');

const { Router } = require("express");

const router = Router();

// Import controller
const controller = require('./controller');

// Define route for requests to home page
router.get("/",
  controller.home
);

// Define route for request to login
router.post("/login",
  passport.authenticate('local',
  { failureRedirect: '/' }),
  controller.login
);

// Define route for request to profile page
router.get("/profile",
//  ensureAuthenticated,
  controller.profile
);

// Define route for request to logout
router.get('/logout',
  controller.logout
);

// Define route for request to register and login
router.post('/register',
  controller.register,
  passport.authenticate('local'),
  (req, res, next) => {
    console.log('passport.authenticate =>');
    res.redirect('/profile');
  }
);

module.exports = router;

// Check if user is authenticated in the session
/*function ensureAuthenticated(req, res, next) {
  console.log('ensureAuthenticated =>');
  if (req.isAuthenticated()) {
    // Pass authenticated users to the profile page
    return next();
  }
  // Redirect other users to home page
  res.redirect('/');
}*/
