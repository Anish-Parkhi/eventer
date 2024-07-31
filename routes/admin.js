const express = require('express');
const admin = require('../models/admin');
const adminMiddleware = require('../middlewares/adminMiddleware');
const event = require('../models/event');
const eventRegistration = require('../models/eventRegistration');
const adminRotuer = express.Router();

// endpoint to create a new event

adminRotuer.post('/', adminMiddleware, async (req, res) => {
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

// route to find all the events hosted by a particular club
adminRotuer.get('/events', adminMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    // find name of club from the email
    const clubInfo = await admin.findOne({ email });
    const eventHostedByClubs = await event.find({
      clubName: clubInfo.clubName,
    });
    if (!eventHostedByClubs) {
      return res.json({ msg: 'No event hosted yet' });
    }
    return res.json({ events: eventHostedByClubs });
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message });
  }
});

// route to update information of a particular event

adminRotuer.patch('/event/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedData = req.body;
    const updatedEvent = await event.findOneAndUpdate(eventId, updatedData, {
      new: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json({ msg: 'Event updated successfully', updatedEvent });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// route to delete a particular event
adminRotuer.delete('/event/:eventId', async (req, res) => {
  try {
    const email = req.body.email;
    // the event should be hosted by the same club
    const eventId = req.params.eventId;
    // the and operator here ensures that one should be able to delete only those events which are hosted by himself
    // and he doesn't delete any other person's events
    await event.deleteOne({ $and: [{ _id: eventId }, { createdBy: email }] });
    return res.json({ msg: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//route to get info of all the participants which are registered to a particular event

adminRotuer.get('/:id/registrations', adminMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(eventId)
    const registrations = await eventRegistration.find({ event: eventId }).populate('participant');
    if(!registrations){
      return res.json({msg:"No regisrations found"})
    }
    return res.json({registrations})
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

module.exports = adminRotuer;
