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

// Set up of authentication (at login or register)...
passport.use(new LocalStrategy(
  async (username, password, done) => {
    console.log('=> passport.use =>');
    try {
      // ...tries to find the user in the database...
      const user = await Users.findOne({ username: username });
      if (!user) {
        console.log("=> user not found =>");
        return done(null, false);
      }
      // ...compares the passwords...
      if (!bcrypt.compareSync(password, user.password)) {
        console.log("=> password does not match =>");
        // ...don't pass if the password don't match...
        return done(null, false);
      }
      // ...or pass the user through passport.serializeUser if the password match
      console.log("=> user found and password matches =>");
      return done(null, user);
    } catch (error) {
      console.log(error);
    }
  }
));

// Saves _id from the user object in the session (at register or login)...
passport.serializeUser((user, done) => {
  // ...then passes back to passport.authenticate (at register) or goes to passport.deserializeUser (at login)...
  console.log('=> passport.serializeUser =>');
  done(null, user._id);
});

// ...user object for _id saved in the session is attached to the request on every request (register, login or logout)...
passport.deserializeUser(async (id, done) => {
  try {
    console.log('=> passport.deserializeUser =>');
    const doc = await Users.findOne({ _id: new ObjectID(id) });
      // ...redirects to profile page through ensureAuthenticated (at register or login) or straight to the home page (at logout)
    done(null, doc);
  } catch (error) {
    console.log(error);
  }
});

module.exports = passport;
