const Conference = require('../models/conferenceModel');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendError = require('../utils/errors');

// Create a conference
exports.createConference = async (req, res, next) => {
  const {
    name,
    acronym,
    webpage,
    venue,
    city,
    country,
    primaryArea,
    secondaryArea,
    topics,
  } = req.body;
  const admin = req.user._id;
  let conference;
  try {
    conference = await Conference.create({
      admin,
      name,
      acronym,
      webpage,
      venue,
      city,
      country,
      primaryArea,
      secondaryArea,
      topics,
    });

    const user = await User.findById(admin);
    let userConferenceAdminList = [...user.conferenceAdmin];
    userConferenceAdminList.push(conference._id);

    user.conferenceAdmin = userConferenceAdminList;
    await user.save();
  } catch (err) {
    return sendError(400, err, res);
  }

  return res.status(201).json({
    success: true,
    conference,
  });
};

// Get all conferences
exports.getAllConferences = async (req, res, next) => {
  try {
    const allConferences = await Conference.find({});
    return res.status(200).json({
      success: true,
      conferences: allConferences,
    });
  } catch (err) {
    return sendError(500, err, res);
  }
};

// Add a Reviewer
exports.addReviewer = async (req, res, next) => {
  const { conferenceId, reviewerEmail, alias } = req.body;
  const user = req.user;
  try {
    const conference = await Conference.findById(conferenceId);
    const reviewer = await User.findOne({ email: reviewerEmail });

    console.log(reviewer);

    if (!conference.admin.equals(user._id)) {
      return sendError(401, 'You should be an admin to add reviewer', res);
    }

    reviewer.conferenceReviewer.push(conferenceId);
    await reviewer.save();

    conference.reviewers.push({ userId: reviewer._id, alias });
    await conference.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return sendError(500, err, res);
  }
};
