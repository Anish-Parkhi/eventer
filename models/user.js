const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  registeredEvents: {
    type: Schema.Types.ObjectId,
    ref: 'eventRegistration',
  },
  fullName: {
    type: String,
  },
  registrationNumber: {
    type: String,
  },
  yearOfStudy: {
    type: Number,
  },
  department: {
    type: String,
  },
  section: {
    type: String,
  },
});

const user = mongoose.model('user', userSchema);

module.exports = user;
