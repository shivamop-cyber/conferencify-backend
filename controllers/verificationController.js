const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { FRONTEND_URL } = require('../config/url');

// Register a User
exports.verifyUserEmail = async (req, res, next) => {
  const { token } = req.params;

  // Verifying the JWT token
  try {
    const { id } = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    const user = await User.findById(id);

    if (!user) {
      return res.redirect(`${FRONTEND_URL}/login?verify=0`);
    }

    if (user.isVerfiedEmail) {
      return res.redirect(`${FRONTEND_URL}/login?verify=2`);
    }
    user.isVerfiedEmail = true;
    user.save();
    return res.redirect(`${FRONTEND_URL}/login?verify=1`);
  } catch (err) {
    return res.redirect(`${FRONTEND_URL}/login?verify=0`);
  }
};
