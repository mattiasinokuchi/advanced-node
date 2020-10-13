// Make handlers available from routes.js
module.exports = {
  // Handler for request to home page
  home: (req, res) => {
    const user = req.session.user;
    res.render("index", { user });
  },
}
