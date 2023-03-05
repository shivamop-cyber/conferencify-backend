const express = require('express');
const { verifyUserEmail } = require('../controllers/verificationController');

const router = express.Router();

router.route('/:token').get(verifyUserEmail);

module.exports = router;
