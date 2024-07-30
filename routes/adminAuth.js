const express = require('express');
const admin = require('../models/admin');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const adminRouter = express.Router();

adminRouter.post('/register', async (req, res) => {
  try {
    const { clubName, email, password } = req.body;
    if (!clubName || !email || !password) {
      return res.json({ msg: 'Missing required parameters' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = new admin({
      clubName,
      email,
      password: hashedPassword,
    });
    const dbRes = await newAdmin.save();
    if (!dbRes) {
      return res.json({ msg: 'Falied to create admin account' });
    }
    return res.json({ msg: 'Admin account created' });
  } catch (error) {
    console.log(error);
    return res.json({ msg: 'Internal server error', error });
  }
});

adminRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ msg: 'Missing required parameters' });
    }
    const adminDetails = await admin.findOne({ email });
    if (!adminDetails) {
      return res.json({ msg: 'Admin not found' });
    }
    const passwordMatched = await bcrypt.compare(
      password,
      adminDetails.password
    );
    if (!passwordMatched) {
      return res.json({ msg: 'Wrong password' });
    }
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET);
    return res.json({ msg: 'Admin login successful', token });
  } catch (error) {
    return res.json({ msg: error });
  }
});

module.exports = adminRouter;
