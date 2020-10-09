// This file contains logic that updates data and view

// Make handlers available from router.js
module.exports = {

  // Handler for request to home page
  home: (req, res) => {
    const user = req.session.user;
    res.render("index", { user });
  }
}
