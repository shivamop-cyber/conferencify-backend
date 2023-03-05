const Conference = require('../models/conferenceModel');
const Paper = require('../models/paperModel');
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

    if (!conference.admin.equals(user._id)) {
      return sendError(401, 'You should be an admin to add reviewer', res);
    }

    reviewer.conferenceReviewer.push(conferenceId);
    await reviewer.save();

    conference.reviewers.push({ userId: reviewer._id, alias });
    await conference.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

// Sumbit Paper
exports.submitPaper = async (req, res, next) => {
  const { conferenceId, authors, title, keywords, abstract, url } = req.body;
  try {
    const conference = await Conference.findById(conferenceId);

    if (!conference) {
      sendError(404, 'Please submit paper to a valid conference');
    }

    const authorIds = [];
    const authorsObjects = [];

    for (const email of authors) {
      const user = await User.findOne({ email: email });

      if (!user) {
        sendError(400, 'All authors should be registered', res);
      }

      authorIds.push(user._id);
      authorsObjects.push(user);
    }

    const paper = await Paper.create({
      title,
      keywords,
      authors: authorIds,
      abstract,
      url,
      paperId: conference.submissions.length + 1,
    });

    for (const author of authorsObjects) {
      author.paperSubmissions.push(paper._id);
      await author.save();
    }

    conference.submissions.push(paper._id);

    await conference.save();

    const populatedConference = await Conference.findById(conference._id)
      .populate('submissions')
      .exec();
    const populatedPaper = await Paper.findById(paper._id)
      .populate('authors')
      .exec();
    return res.status(200).json({
      success: true,
      conference,
      paper,
      populatedConference,
      populatedPaper,
    });
  } catch (err) {
    console.log(err);
    return sendError(500, 'Server Error Occured', res);
  }
};
