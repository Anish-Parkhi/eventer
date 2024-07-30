const express = require('express');
const admin = require('../models/admin');
const adminMiddleware = require('../middlewares/adminMiddleware');
const event = require('../models/event');
const adminRotuer = express.Router();

// route to find all the events hosted by a particular club
adminRotuer.get('/events', adminMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)
    // find name of club from the email
    const clubInfo = await admin.findOne({ email });
    console.log(clubInfo.clubName)
    const eventHostedByClubs = await event.find({ clubName: clubInfo.clubName });
    if (!eventHostedByClubs) {
      return res.json({ msg: 'No event hosted yet' });
    }
    return res.json({ events: eventHostedByClubs });
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message });
  }
});

module.exports = adminRotuer;
