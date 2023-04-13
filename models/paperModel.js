const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  authors: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: [true, 'Please enter the authors fo the paper'],
  },
  conferenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conference',
    required: [true, 'Please enter the conference id'],
  },
  title: {
    type: String,
    required: [true, 'Please enter the Keywords'],
  },
  keywords: {
    type: String,
    required: [true, 'Please enter the Keywords'],
  },
  abstract: {
    type: String,
    required: [true, 'Please enter the abstract'],
  },
  url: {
    type: String,
    required: [true, 'Please upload the file'],
  },
  paperId: {
    type: Number,
    required: true,
  },
  plagiarismPercentage: {
    type: String,
    default: 'N/A',
  },
  status: {
    type: String,
    default: 'Unassigned',
  },
  review: {
    type: [
      {
        question: { type: String },
        verdict: { type: String },
      },
    ],
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Paper', paperSchema);
