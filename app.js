const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({ path: 'config/config.env' });
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: '*',
  })
);

// Route Imports
const user = require('./routes/userRoute');
const conference = require('./routes/conferenceRoute');
const verify = require('./routes/verification');

app.use('/api/v1/user', user);
app.use('/api/v1/conference', conference);
app.use('/verify', verify);

module.exports = app;
