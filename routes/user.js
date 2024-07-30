const express = require('express');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const userExists = await user.findOne({ email });
    if (userExists) {
      return res.status(200).json({ msg: 'User already exists' });
    }
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new user({ email, password: hash });
    await newUser.save();
    return res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userExists = await user.findOne({ email });
  if (!userExists) {
    return res.status(400).json({ msg: "User doesn't exists" });
  }
  const passwordMatched = await bcrypt.compare(password, userExists.password);
  if (!passwordMatched) {
    return res.status(200).json({ msg: 'Invalid password' });
  }
  const token = jwt.sign({ email, role: 'user' }, process.env.JWT_SECRET);
  return res.json({ msg: 'user logged in successfully', token });
});

module.exports = router;
