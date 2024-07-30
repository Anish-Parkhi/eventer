const express = require('express');
const event = require('../models/event');
const adminMiddleware = require('../middlewares/adminMiddleware');
const eventRouter = express.Router();
const userAuthMiddleware = require('../middlewares/userValidation');
const eventRegistration = require('../models/eventRegistration');
const user = require('../models/user');
const admin = require('../models/admin');

// endpoint to create a new event
// take the created by name from the admin jwt
eventRouter.post('/', adminMiddleware, async (req, res) => {
  try {
    const {
      eventName,
      description,
      venue,
      speakerName,
      extraLink,
      startDate,
      endDate,
    } = req.body;
    if (!eventName || !venue || !speakerName || !startDate || !endDate) {
      return res.json({ msg: 'missing required parameters' });
    }
    const createdBy = req.body.email;
    const clubInfo = await admin.findOne({ email: createdBy });
    const newEvent = new event({
      name: eventName,
      description,
      venue,
      clubName: clubInfo.clubName,
      speakerName,
      extraLink,
      startDate,
      endDate,
      createdBy,
    });
    const response = await newEvent.save();
    if (!response) {
      return res.json({ msg: 'Event creation failed' });
    }
    return res.json({ msg: 'Event created successfully' });
  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
});

// route to get all the events
eventRouter.get('/', userAuthMiddleware, async (req, res) => {
  const events = await event.find();
  if (!events) {
    return res.json({ msg: 'No events found' });
  }
  return res.json({ events });
});

// fetch all the events for which the user has registerd

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

// route to get an event by its id;

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


//register for the event
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
