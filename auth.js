// Import authentication middleware
const passport = require('passport');

// Import module for authentication with local strategy (username and password)
const LocalStrategy = require('passport-local');

// Import module for comparing hashed passwords
const bcrypt = require('bcrypt');

// Define constructor for user id
const ObjectID = require('mongodb').ObjectID;

// Import data model
const Users = require("./model");

// Define how to authenticate someone locally (at login or register)...
passport.use(new LocalStrategy(
  async (username, password, done) => {
    // ...try to find the user in the database...
    try {
      console.log('passport.use =>');
      await Users.findOne({ username: username }, function (err, user) {
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
    } catch (error) {
      console.log(error);
    }
  }
));

// Saves _id from the user object in the session (at register or login)...
passport.serializeUser((user, done) => {
  // ...then passes back to passport.authenticate (at register) or goes to passport.deserializeUser (at login)...
  console.log('passport.serializeUser =>');
  done(null, user._id);
});

// ...user object for _id saved in the session is attached to the request on every request (register, login or logout)...
passport.deserializeUser(async (id, done) => {
  try {
    console.log('passport.deserializeUser =>');
    await Users.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      if (err) return console.error(err);
      // ...redirects to profile page through ensureAuthenticated (at register or login) or straight to the home page (at logout)
      done(null, doc);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = passport;
