const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
  clubName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const admin = mongoose.model('admin', adminSchema);

module.exports = admin;
