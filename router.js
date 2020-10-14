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
    res.redirect('/profile');
  }
);

module.exports = router;
