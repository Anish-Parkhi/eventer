const express = require('express');
const userAuth = require('./user');
const adminAuth = require('./adminAuth');
const eventRotuer = require('./event');
const adminRotues = require('./admin');

const router = express.Router();

router.use('/auth', userAuth);
router.use('/auth/admin', adminAuth);
router.use('/event', eventRotuer);
router.use('/admin', adminRotues);

module.exports = router;
