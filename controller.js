// This file contains logic that updates data and view

// Make handlers available from router.js
module.exports = {

  // Handler for request to home page
  home: (req, res) => {
    console.log('app.route("/")');
    res.render('pug', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true
    });
  },

  // Handler for request to login
  /*login: function(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    // ...then redirects to profile page through ensureAuthenticated if successful
    res.redirect('/profile');
  });*/
}
