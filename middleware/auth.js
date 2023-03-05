const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sendError = require('../utils/errors');

exports.authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: 'Please Login to access this resource',
    });
  }

  const splitAuth = authorization.split(' ');
  const token = splitAuth[1];

  let decodedData;

  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return sendError(401, 'Invalid Access Token', res);
  }

  try {
    req.user = await User.findById(decodedData.id);
  } catch (err) {
    return sendError(500, 'Server Error Occured', res);
  }

  if (!req.user) {
    return sendError(401, 'Invalid User', res);
  }

  next();
};
