const express = require('express');
const {
  createConference,
  getAllConferences,
  addReviewer,
  submitPaper,
} = require('../controllers/conferenceController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.route('/create').post(authenticateUser, createConference);

router.route('/all').get(getAllConferences);

router.route('/reviewer/add').post(authenticateUser, addReviewer);

router.route('/paper/submit').post(authenticateUser, submitPaper);

// router.route('/me').get(authenticateUser, getUserDetails);

// router.route('/password/update').put(authenticateUser, updatePassword);

// router.route('/me/update').put(authenticateUser, updateProfile);

module.exports = router;
