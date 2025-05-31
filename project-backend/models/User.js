const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  interests: { type: [String], default: [] },
  password: { type: String, required: true }, // assuming password is part of SignupPayload
});

module.exports = mongoose.model('User', UserSchema);
