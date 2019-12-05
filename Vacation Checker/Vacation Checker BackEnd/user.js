const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  date: String,
  vacations: Array,
});
const User = mongoose.model("User", userSchema);
module.exports = User;
