// This file defines data used in the app

// Mount database framework
const mongoose = require("mongoose");

// Connect and set up database
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

// Get notified if database connects successfully or not
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to database");
});

// Define schema (constructor) for MongoDB documents
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Define model (class) for MongoDB documents
const Users = mongoose.model("Users", userSchema);

// Make model available for import
module.exports = Users;
