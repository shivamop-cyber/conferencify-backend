const Conference = require('../models/conferenceModel');
const Paper = require('../models/paperModel');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendError = require('../utils/errors');
const { sendUserEmail } = require('../utils/email');

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
    message: 'Conference Successfully Created',
    conference,
  });
};

// Get all conferences
exports.getAllConferences = async (req, res, next) => {
  try {
    const allConferences = await Conference.find({}).select(
      'name acronym webpage'
    );
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

    if (!reviewer) {
      return sendError(400, 'The reviewer is not registered', res);
    }

    reviewer.conferenceReviewer.push(conferenceId);
    await reviewer.save();

    conference.reviewers.push({ userId: reviewer._id, alias });
    await conference.save();

    return res
      .status(200)
      .json({ success: true, message: 'Reviewer Successfully added' });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

// Sumbit Paper
exports.submitPaper = async (req, res, next) => {
  const { conferenceId, authors, title, keywords, abstract, url } = req.body;
  try {
    const conference = await Conference.findById(conferenceId);

    if (conference.isConferenceOpen === false) {
      sendError(404, 'Conference has been closed', res);
    }

    if (!conference) {
      sendError(404, 'Please submit paper to a valid conference', res);
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
      conferenceId,
    });

    for (const author of authorsObjects) {
      author.paperSubmissions.push(paper._id);
      await author.save();
    }

    conference.submissions.push(paper._id);

    await conference.save();

    // const populatedConference = await Conference.findById(conference._id)
    //   .populate('submissions')
    //   .exec();
    // const populatedPaper = await Paper.findById(paper._id)
    //   .populate('authors')
    //   .exec();
    return res.status(200).json({
      success: true,
      message: 'Paper successfully submitted',
      conference,
      paper,
    });
  } catch (err) {
    console.log(err);
    return sendError(500, 'Server Error Occured', res);
  }
};

// Assigning a reviewer for a paper
exports.assignReviewer = async (req, res, next) => {
  const { conferenceId, paperId, reviewerId } = req.body;
  const user = req.user;
  try {
    const conference = await Conference.findById(conferenceId);
    const reviewer = await User.findById(reviewerId);
    const paper = await Paper.findById(paperId);

    if (!conference.admin.equals(user._id)) {
      return sendError(401, 'You should be an admin to assign reviewer', res);
    }

    if (!reviewer) {
      return sendError(400, 'Enter a valid reviewer', res);
    }

    paper.reviewer = reviewerId;
    paper.status = 'Pending';
    await paper.save();

    return res
      .status(200)
      .json({ success: true, message: 'Reviewer Successfully assigned' });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

exports.submitReview = async (req, res, next) => {
  console.log(req.body);
  const { paperId, verdict, review } = req.body;
  const user = req.user;
  console.log(req.user);
  try {
    const paper = await Paper.findById(paperId);
    const conference = await Conference.findById(paper.conferenceId);

    if (conference.isConferenceOpen === false) {
      sendError(404, 'Conference has been closed', res);
    }

    if (!paper.reviewer.equals(user._id)) {
      return sendError(401, 'You should be reviewer to submit review', res);
    }

    paper.status = verdict == 'accept' ? 'Approved' : 'Rejected';
    paper.review = review;
    await paper.save();

    return res
      .status(200)
      .json({ success: true, message: 'Review successfully submitted' });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

// Get a Conference
exports.getConference = async (req, res, next) => {
  const { conferenceId } = req.params;
  const user = req.user;
  try {
    const conference = await Conference.findById(conferenceId);

    if (!conference) {
      return sendError(403, 'Conference does not exist', res);
    }

    if (!conference.admin.equals(user._id)) {
      return sendError(
        401,
        'You should be an admin to get conference details',
        res
      );
    }

    const conferenceDetails = await Conference.findById(conferenceId)
      .populate({ path: 'reviewers' })
      .populate({ path: 'submissions', populate: { path: 'authors' } });

    return res
      .status(200)
      .json({ success: true, conference: conferenceDetails });
  } catch (err) {
    console.log(err);
    return sendError(500, 'Server Error Occured', res);
  }
};

exports.sendUserEmail = async (req, res, next) => {
  const { conferenceId, paperIds, mailSubject, mailBody } = req.body;
  console.log(req.body);
  const user = req.user;

  try {
    for (let i = 0; i < paperIds.length; i++) {
      const paperId = paperIds[i];

      const paper = await Paper.findOne({ paperId: paperId }).populate(
        'authors'
      );
      const conference = await Conference.findById(conferenceId);

      // console.log('Authors', paper.authors);
      const authors = [...paper.authors];
      console.log('Authors ', authors);

      for (let j = 0; j < authors.length; j++) {
        await sendUserEmail(
          authors[j].email,
          mailSubject,
          mailBody,
          authors[j].name,
          conference.acronym,
          paperId,
          paper.title
        );
      }
    }
  } catch (err) {
    console.log(err);
    return sendError(500, 'Server error occured', res);
  }

  res.status(200).json({
    success: true,
    message: 'Emails have been send successfully',
  });
};

// Assigning a reviewer for a paper
exports.getReviewPapers = async (req, res, next) => {
  const { conferenceId } = req.params;
  const user = req.user;
  try {
    const conference = await Conference.findById(conferenceId);
    const papers = await Paper.find({
      conferenceId: conferenceId,
      reviewer: user._id,
    });

    if (!conference) {
      return sendError(404, 'Invalid Conference', res);
    }

    return res.status(200).json({
      success: true,
      message: 'Papers successfully fetched',
      papers,
      conference,
    });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

exports.submitPlagPercentage = async (req, res, next) => {
  const { conferenceId, paperId, plagPercentage } = req.body;
  const user = req.user;
  try {
    const conference = await Conference.findById(conferenceId);
    const paper = await Paper.findById(paperId);

    if (!conference.admin.equals(user._id)) {
      return sendError(401, 'You should be an admin to assign reviewer', res);
    }

    paper.plagiarismPercentage = plagPercentage;
    await paper.save();

    return res.status(200).json({
      success: true,
      message: 'Plagiarism Percentage Successfully Saved',
    });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

exports.changeConferenceStatus = async (req, res, next) => {
  const { conferenceId } = req.body;
  const user = req.user;
  try {
    const conference = await Conference.findById(conferenceId);

    if (!conference.admin.equals(user._id)) {
      return sendError(401, 'You should be an admin to assign reviewer', res);
    }

    conference.isConferenceOpen = !conference.isConferenceOpen;

    await conference.save();

    return res.status(200).json({
      success: true,
      message: `Conference Status changed to ${
        conference.isConferenceOpen === true ? 'Open' : 'Closed'
      }`,
    });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

exports.changeConferenceConfiguration = async (req, res, next) => {
  const { conferenceId, confData } = req.body;
  const user = req.user;
  try {
    const conference = await Conference.findById(conferenceId);

    if (!conference.admin.equals(user._id)) {
      return sendError(401, 'You should be an admin to assign reviewer', res);
    }

    conference.name = confData.name;
    conference.acronym = confData.acronym;
    conference.webpage = confData.webpage;
    conference.venue = confData.venue;
    conference.city = confData.city;
    conference.country = confData.country;
    conference.primaryArea = confData.primaryArea;
    conference.secondaryArea = confData.secondaryArea;
    conference.topics = confData.topics;

    await conference.save();

    return res.status(200).json({
      success: true,
      message: `Successfully updated the conference Info`,
      conference: conference,
    });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

exports.getReviewersSummary = async (req, res, next) => {
  const { conferenceId } = req.params;
  const user = req.user;

  try {
    const conference = await Conference.findById(conferenceId).populate({
      path: 'reviewers',
      populate: { path: 'userId' },
    });

    if (!conference.admin.equals(user._id)) {
      return sendError(401, 'You should be an admin to assign reviewer', res);
    }

    const papers = await Paper.find({ conferenceId: conferenceId });
    const reviewers = conference.reviewers;

    const reviewerInfo = reviewers.map((reviewer, index) => {
      console.log(reviewer.userId._id, index);
      const filteredPapers = papers.filter((paper) => {
        console.log(paper);
        return paper.reviewer && paper.reviewer.equals(reviewer.userId._id);
      });

      console.log('here');
      const unreviewedPapers = filteredPapers.filter(
        (paper) => paper.status === 'Pending'
      );

      const totalAssigned = filteredPapers.length;
      return {
        reviewerName: reviewer.userId.name,
        id: index,
        email: reviewer.userId.email,
        totalAssigned: totalAssigned,
        totalCompleted: totalAssigned - unreviewedPapers.length,
        totalLeft: unreviewedPapers.length,
      };
    });

    console.log(reviewerInfo);

    return res.status(200).json({
      success: true,
      message: `Successfully updated the conference Info`,
      reviewInfo: reviewerInfo,
    });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};
