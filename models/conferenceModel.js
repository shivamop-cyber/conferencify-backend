const mongoose = require('mongoose');
const validator = require('validator');

const conferenceSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please signin to create conference'],
  },
  name: {
    type: String,
    required: [true, 'Please enter the conference name'],
  },
  acronym: {
    type: String,
    required: [true, 'Please enter the conference acronym'],
    unique: true,
  },
  webpage: {
    type: String,
    required: [true, 'Please enter the conference webpage'],
    validate: [validator.isURL, 'Please Enter a valid webpage URL'],
  },
  venue: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  primaryArea: {
    type: String,
    required: [true, 'Please enter the primary research area'],
  },
  secondaryArea: {
    type: String,
    required: [true, 'Please enter the secondary research area'],
  },
  topics: {
    type: [String],
    required: [true, 'Please enter the topics'],
  },
  reviewers: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        alias: String,
      },
    ],
    default: [],
  },
  submissions: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paper' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Conference', conferenceSchema);
