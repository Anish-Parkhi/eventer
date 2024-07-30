const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  name: {
    required: true,
    minLength: 5,
    type: String,
  },
  description: {
    type: String,
  },
  venue: {
    required: true,
    type: String,
  },
  clubName: {
    required: true,
    type: String,
  },
  speakerName: {
    required: true,
    type: String,
  },
  extraLink: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: String,
    required: String
  }
});

const event = mongoose.model('event', eventSchema);

module.exports = event;
