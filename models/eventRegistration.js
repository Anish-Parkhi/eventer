const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventRegistrationSchema = mongoose.Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'event',
  },
  participant: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  hostedBy: {
    type: Schema.Types.ObjectId,
    ref: 'admin'
  }
});

const eventRegistration = mongoose.model(
  'eventRegistration',
  eventRegistrationSchema
);

module.exports = eventRegistration;
