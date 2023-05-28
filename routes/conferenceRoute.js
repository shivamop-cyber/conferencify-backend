const express = require('express');
const {
  createConference,
  getAllConferences,
  addReviewer,
  submitPaper,
  assignReviewer,
  submitReview,
  getConference,
  sendUserEmail,
  getReviewPapers,
  submitPlagPercentage,
  changeConferenceStatus,
  changeConferenceConfiguration,
  getReviewersSummary,
} = require('../controllers/conferenceController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.route('/create').post(authenticateUser, createConference);

router.route('/all').get(getAllConferences);

router.route('/single/:conferenceId').get(authenticateUser, getConference);

router
  .route('/review/paper/:conferenceId')
  .get(authenticateUser, getReviewPapers);

router.route('/reviewer/add').post(authenticateUser, addReviewer);

router.route('/paper/submit').post(authenticateUser, submitPaper);

router.route('/reviewer/assign').post(authenticateUser, assignReviewer);

router.route('/paper/review/submit').post(authenticateUser, submitReview);

router.route('/email/send').post(authenticateUser, sendUserEmail);

router.route('/plag/submit').post(authenticateUser, submitPlagPercentage);

router.route('/status/change').post(authenticateUser, changeConferenceStatus);

router
  .route('/configuration/change')
  .post(authenticateUser, changeConferenceConfiguration);

router
  .route('/reviewer/summary/:conferenceId')
  .get(authenticateUser, getReviewersSummary);

module.exports = router;
