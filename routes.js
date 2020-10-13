// Import authentication middleware
const passport = require('passport');

// Import module for hashing password
const bcrypt = require('bcrypt');

// Import data model
const client = require("./model");

const { Router } = require("express");

const router = Router();

const Users = require("./model");

// Import controller
const controller = require('./controller');

// Route handler for requests to home page
router.get("/", function (req, res) {
  console.log("/");
  res.render('pug', {
    title: 'Connected to Database',
    message: 'Please login',
    showLogin: true,
    showRegistration: true
  });
});

// Route handler for request to login
router.post("/login",
  passport.authenticate('local', { failureRedirect: '/' }),
  (req, res) => {
    console.log("/login =>");
    res.redirect('/profile');
  }
);

// Route handler for request to profile page
router.get("/profile",
  ensureAuthenticated,
  (req, res) => {
    console.log("/profile");
    res.render('pug/profile', { username: req.user.username });
  }
);

// Route handler for request to logout
router.get('/logout', (req, res) => {
  console.log("/logout =>");
  req.logout();
  res.redirect('/');
});

// Route handler for request to register and then login...
router.post('/register',
  async(req, res, next) => {
    try {
      //...salts and hashes the password...
      const hash = bcrypt.hashSync(req.body.password, 12);
      // ...searches for the username in the database...
      //const user = await client.db('database').collection('users').findOne({ username: req.body.username });
      const user = await Users.findOne({ username: req.body.username });
      if (user) {
        // ...redirects back if username already is taken...
        res.redirect('/');
      } else {
        // ...or inserts the username with the salted and hashed password...
        //const doc = await client.db('database').collection('users').insertOne({ username: req.body.username, password: hash });
        const doc = await Users.create({ username: req.body.username, password: hash });
        // ...then passes user object down to passport.authenticate...
        next(null, doc[0]);
      }
    } catch (error) {
      console.log(error);
    }
  },
  // ...which will call req.login (a function attached to the request which will call passport.serializeUser) or redirect to home page...
  passport.authenticate('local'),
  (req, res, next) => {
    console.log('passport.authenticate =>');
    // ...I'm back from passport.serializeUser and success!...now I will get passed through passport.deserializeUser and ensureAuthenicated before I'm redirected to the profile page
    res.redirect('/profile');
  }
);

module.exports = router;

// Check if user is authenticated in the session...
function ensureAuthenticated(req, res, next) {
  console.log('ensureAuthenticated =>');
  if (req.isAuthenticated()) {
    // ...and pass authenticated user to the profile page...
    return next();
  }
  // ...or redirects to home page if user is not
  res.redirect('/');
}
