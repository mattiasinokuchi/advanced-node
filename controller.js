// This file contains logic that updates data and view

// Import authentication middleware
const passport = require('passport');

// Import module for authentication with local strategy (username and password)
const LocalStrategy = require('passport-local');

// Define constructor for user id
const ObjectID = require('mongodb').ObjectID;

// Import module for hashing password
const bcrypt = require('bcrypt');

const { MongoClient } = require('mongodb');

const URI = process.env.MONGO_URI; // Declare MONGO_URI in your .env file

const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB cluster
client.connect();

// Make handlers available from router.js
module.exports = {

  // Handler for request to home page
  home: (req, res) => {
    res.render('pug', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true
    });
  },

  // Handler for request to login
  login: (req, res) => {
      // ...then redirects to profile page through ensureAuthenticated if successful
      res.redirect('/profile');
  },

  // Handler for request to the profile page
  profile: ensureAuthenticated, (req, res) => {
    console.log('app.route("/profile") =>');
    res.render('pug/profile', { username: req.user.username });
  },

  // Handler for request to logout
  logout: (req, res) => {
    req.logout();
    res.redirect('/');
  },

  // Handler for request to register
  register: async(req, res, next) => {
    try {
      //...salts and hashes the password...
      const hash = bcrypt.hashSync(req.body.password, 12);
      // ...searches for the username in the database...
      const user = await client.db('database').collection('users').findOne({ username: req.body.username });
      if (user) {
        // ...redirects back if username already is taken...
        res.redirect('/');
      } else {
        // ...or inserts the username with the salted and hashed password...
        const doc = await client.db('database').collection('users').insertOne({ username: req.body.username, password: hash });
        // ...then passes user object down to passport.authenticate...
        next(null, doc.ops[0]);
      }
    } catch (error) {
      console.log(error);
    }
  },
  // ...which will call req.login (a function attached to the request which will call passport.serializeUser) or redirect to home page...
  passport.authenticate('local', { failureRedirect: '/' }),
  (req, res, next) => {
    console.log('passport.authenticate =>');
    // ...I'm back from passport.serializeUser and success!...now I will get passed through passport.deserializeUser and ensureAuthenicated before I'm redirected to the profile page
    res.redirect('/profile');
  }
}

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

// Define how to authenticate someone locally (at login or register)...
passport.use(new LocalStrategy(
  function (username, password, done) {
    // ...try to find the user in the database...
    console.log('passport.use =>');
    client.db('database').collection('users').findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // ...compare the passwords...
      if (!bcrypt.compareSync(password, user.password)) {
        // ...don't pass if the password don't match...
        return done(null, false);
      }
      // ...or pass the user through passport.serializeUser if the password match
      return done(null, user);
    });
  }
));

// Saves _id from the user object in the session (at register or login)...
passport.serializeUser((user, done) => {
  // ...then passes back to passport.authenticate (at register) or passport.session finds _id in the session (request is authenticated) and invokes passport.deserializeUser below (at login)...
  console.log('passport.serializeUser =>');
  done(null, user._id);
});

// ...user object for _id saved in the session is attached to the request on every request (register, login or logout)...
passport.deserializeUser((id, done) => {
  console.log('passport.deserializeUser =>');
  client.db('database').collection('users').findOne({ _id: new ObjectID(id) }, (err, doc) => {
    if (err) return console.error(err);
    // ...redirects to profile page through ensureAuthenticated (at register or login) or straight to the home page (at logout)
    done(null, doc);
  });
});
