const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;
const cors = require('cors');
const router = require('./routes/index')
require('dotenv').config();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.mongoDB_Connection_URL)
  .then((res) => {
    console.log('connected to database');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
