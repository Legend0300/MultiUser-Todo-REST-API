const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  } ,
  usertype: {
    type: String,
    required: true
  }
});
const User = mongoose.model('User', userSchema);

module.exports =  User;