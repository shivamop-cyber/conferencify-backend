const express = require('express');
const {
  registerUser,
  loginUser,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/me').get(authenticateUser, getUserDetails);

router.route('/password/update').put(authenticateUser, updatePassword);

router.route('/me/update').put(authenticateUser, updateProfile);

// Only for testing
router.route('/all').get(getAllUsers);

module.exports = router;
