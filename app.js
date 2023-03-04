const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({ path: 'config/config.env' });
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route Imports
// const product = require("./routes/productRoute");
const user = require('./routes/userRoute');
const conference = require('./routes/conferenceRoute');
// const payment = require("./routes/paymentRoute");

// app.use("/api/v1", product);
app.use('/api/v1/user', user);
app.use('/api/v1/conference', conference);
// app.use("/api/v1", payment);

// Middleware for Errors

module.exports = app;
