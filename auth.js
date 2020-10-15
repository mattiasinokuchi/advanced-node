// This file contains logic for the authentication

// Import authentication middleware
const passport = require('passport');

// Import module for authentication with username and password
const LocalStrategy = require('passport-local');

// Import module for comparing encrypted passwords
const bcrypt = require('bcrypt');

// Define constructor for user id
const ObjectID = require('mongodb').ObjectID;

// Import database model
const Users = require("./model");

// Set up of authentication (starts at request to login or register) which...
passport.use(new LocalStrategy(
  async (username, password, done) => {
    console.log('passport.use =>');
    try {
      // ...tries to find the user in the database...
      const user = await Users.findOne({ username: username });
      if (!user) {
        console.log("=> user not found =>");
        // ...don't pass the request if username is missing...
        return done(null, false);
      }
      // ...or compares the passwords...
      if (!bcrypt.compareSync(password, user.password)) {
        console.log("=> password does not match =>");
        // ...don't pass the request if password does not match...
        return done(null, false);
      }
      // ...or pass the request to passport.serializeUser (if password matches)...
      console.log("=> user found and password matches =>");
      return done(null, user);
    } catch (error) {
      console.log(error);
    }
  }
));

// ...which is a function...
passport.serializeUser((user, done) => {
  console.log('=> passport.serializeUser =>');
  // ...that attaches _id to the session and passes the request (to the login route)
  done(null, user._id);
});

// Function called from the router (at login or logout)...
passport.deserializeUser(async (id, done) => {
  try {
    console.log('=> passport.deserializeUser =>');
    // ...which gets the user from the database using _id saved in the session...
    const doc = await Users.findOne({ _id: new ObjectID(id) });
      // ...attaches it to the session and passes the request to the router (for profile page or logout)
    done(null, doc);
  } catch (error) {
    console.log(error);
  }
});

module.exports = passport;
