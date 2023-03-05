const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Register a User
exports.verifyUserEmail = async (req, res, next) => {
  const { token } = req.params;

  // Verifying the JWT token
  try {
    const { id } = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    const user = await User.findById(id);

    if (!user) {
      return res.send(`Invalid User`);
    }

    if (user.isVerfiedEmail) {
      return res.send(`Email verification is already done`);
    }
    user.isVerfiedEmail = true;
    user.save();
    return res.send(`Email verifified successfully`);
  } catch (err) {
    return res.send(
      `Email verification failed, possibly the link is invalid or expired`
    );
  }
};
