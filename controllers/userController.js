const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendError = require('../utils/errors');
const { sendVerificationEmail } = require('../utils/email');

// Register a User
exports.registerUser = async (req, res, next) => {
  const { name, email, password, affiliation } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
      affiliation,
    });

    // sendToken(user, 201, res);

    sendVerificationEmail(user._id, user.email);

    return res.status(201).json({
      success: true,
      message: 'User has been registered, Please verify the email to continue',
    });
  } catch (err) {
    return sendError(500, err.message, res);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // checking if user has given password and email both

    if (!email || !password) {
      return sendError(400, 'Invalid email or password', res);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user.isVerfiedEmail) {
      return sendError(401, 'Please verify your email to login', res);
    }

    if (!user) {
      return sendError(401, 'Invalid email or password', res);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return sendError(401, 'Invalid email or password', res);
    }

    return sendToken(user, 200, res);
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

// update User password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return sendError(401, 'Old password is incorrect', res);
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return sendError(400, 'password does not match', res);
    }

    user.password = req.body.newPassword;

    await user.save();

    return sendToken(user, 200, res);
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

// update User Profile
exports.updateProfile = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    affiliation: req.body.affiliation,
  };
  try {
    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (!user) {
      return sendError(400, 'Invalid User', res);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

// Get User Detail
exports.getUserDetails = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user._id)
      .populate('conferenceAdmin')
      .populate('conferenceReviewer')
      .populate('paperSubmissions');
    res.status(200).json({
      success: true,
      user: userDetails,
    });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};

// Only for testing
exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    res.send({
      success: true,
      users: allUsers,
    });
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }
};
