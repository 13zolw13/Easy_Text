const express = require("express");
const {
  body,
  validationResult
} = require('express-validator');
const router = express.Router();
const chat = require('../controllers/chat');
const catchAsync = require('../utilities/catchAsync');
const {
    isLoggedIn
} = require('../middleware/middleware');

router.route('/chat/:id').post(chat.pusherChat).get(chat.renderChat);
router.post("/pusher/auth", isLoggedIn, catchAsync(chat.pusherAuth));

module.exports = router;