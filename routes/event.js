const express = require('express');
const event = require('../models/event');
const adminMiddleware = require('../middlewares/adminMiddleware');
const eventRouter = express.Router();
const userAuthMiddleware = require('../middlewares/userValidation');
const eventRegistration = require('../models/eventRegistration');
const user = require('../models/user');
const admin = require('../models/admin');

// route to get all the events -> by user
eventRouter.get('/', userAuthMiddleware, async (req, res) => {
  const events = await event.find();
  if (!events) {
    return res.json({ msg: 'No events found' });
  }
  return res.json({ events });
});


// fetch all the events for which the user has registerd -> by user
eventRouter.get('/registeredEvents', userAuthMiddleware, async (req, res) => {
  const email = req.body.email;
  const userId = await user.findOne({ email });
  const registeredEvents = await eventRegistration
    .find({ participant: userId._id })
    .populate('event')
    .select('-participant');
  if (!registeredEvents) {
    return res.json({ msg: 'Not registered to any events' });
  }
  return res.json({ registeredEvents });
});

// route to get an event by its id; -> by user
eventRouter.get('/:id', userAuthMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      return res.json({ msg: 'Missing event id' });
    }
    const eventDetails = await event.findById(eventId).select('-_id');
    if (!eventDetails) {
      return res.json({ msg: 'Event not found' });
    }
    return res.json({ eventDetails });
  } catch (error) {
    return res.json({ msg: 'Event not found' });
  }
});


//register for the event -> By user
eventRouter.post('/register', userAuthMiddleware, async (req, res) => {
  try {
    const email = req.body.email;
    const { eventId } = req.body;
    const userId = await user.findOne({ email });
    const newRegistration = new eventRegistration({
      event: eventId,
      participant: userId,
    });
    await newRegistration.save();
    return res.json({ msg: 'Registration successfull' });
  } catch (error) {
    return res.json({ error });
  }
});

module.exports = eventRouter;
