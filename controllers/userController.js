const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendError = require('../utils/errors');

// Register a User
exports.registerUser = async (req, res, next) => {
  const { name, email, password, affiliation } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    affiliation,
  });

  sendToken(user, 201, res);
};

// Login User
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return sendError(400, 'Invalid email or password', res);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return sendError(401, 'Invalid email or password', res);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return sendError(401, 'Invalid email or password', res);
  }

  sendToken(user, 200, res);
};

// update User password
exports.updatePassword = async (req, res, next) => {
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

  sendToken(user, 200, res);
};

// update User Profile
exports.updateProfile = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    affiliation: req.body.affiliation,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
};

// Get User Detail
exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
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
    return sendError(500, err, res);
  }
};
