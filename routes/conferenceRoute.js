const express = require('express');
const {
  createConference,
  getAllConferences,
  addReviewer,
  submitPaper,
  assignReviewer,
  submitReview,
  getConference,
} = require('../controllers/conferenceController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.route('/create').post(authenticateUser, createConference);

router.route('/all').get(getAllConferences);

router.route('/single/:conferenceId').get(authenticateUser, getConference);

router.route('/reviewer/add').post(authenticateUser, addReviewer);

router.route('/paper/submit').post(authenticateUser, submitPaper);

router.route('/reviewer/assign').post(authenticateUser, assignReviewer);

router.route('/paper/review/submit').post(authenticateUser, submitReview);

module.exports = router;
