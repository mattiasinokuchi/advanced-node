require('dotenv').config();

// Fix silent errors
'use strict';

// Import web app framework
const express = require('express');

// Import module for database connection
const myDB = require('./connection');

// Import module for FCC tests
const fccTesting = require('./freeCodeCamp/fcctesting.js');

// Import middleware (function for processing a request) for checking previous requests from clients using cookies
const session = require('express-session');

// Import authentication middleware
const passport = require('passport');

// Import module for handle requests
const routes = require('./routes.js')

// Import module for authentication
const auth = require('./auth.js')

// Create an Express application
const app = express();

// Set template engine
app.set('view engine', 'pug');

// Call FCC test
fccTesting(app);

// Enable middleware for static files (this middleware will be called for every call to the application)
app.use('/public', express.static(process.cwd() + '/public'));

// Enable middleware to parse request objects as JSON Object (this middleware will be called for every call to the application)
app.use(express.json());

// Enable middleware to parse request objects as strings or arrays (this middleware will be called for every call to the application)
app.use(express.urlencoded({ extended: true }));

// Enable middleware for session (this middleware will be called for every call to the application)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect app with database
myDB(async (client) => {
  const myDataBase = await client.db('database').collection('users');
  routes(app, myDataBase);
  auth(app, myDataBase);
}).catch((e) => {
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + process.env.PORT);
});
