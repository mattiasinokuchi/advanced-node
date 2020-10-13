// Import web app framework
const express = require('express');

// Create an Express application
const app = express();

// Import authentication middleware
const passport = require('passport');

// Import module for authentication with local strategy (username and password)
const LocalStrategy = require('passport-local');

// Import module for comparing hashed passwords
const bcrypt = require('bcrypt');

// Define constructor for user id
const ObjectID = require('mongodb').ObjectID;

const { MongoClient } = require('mongodb');

const URI = process.env.MONGO_URI; // Declare MONGO_URI in your .env file

const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();

// Import module for handle requests
const routes = require('./routes.js')

// Import module for authentication
const auth = require('./auth.js')

// Import module for database connection
const myDB = require('./connection');

// Connect app with database
/*myDB(async (client) => {
  const myDataBase = await client.db('database').collection('users');
}).catch((e) => {
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});*/

// Export module for authentication
//module.exports = function (app, myDataBase) {

  // Define how to authenticate someone locally (at login or register)...
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      // ...try to find the user in the database...
      try {
        console.log('passport.use =>');
        await client.db('database').collection('users').findOne({ username: username }, function (err, user) {
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
      await client.db('database').collection('users').findOne({ _id: new ObjectID(id) }, (err, doc) => {
        if (err) return console.error(err);
        // ...redirects to profile page through ensureAuthenticated (at register or login) or straight to the home page (at logout)
        done(null, doc);
      });
    } catch (error) {
      console.log(error);
    }
  });
//}

module.exports = passport;
