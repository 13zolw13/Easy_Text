const express = require("express");
const router = express.Router();
const page = require('../controllers/dashboard');


router.get("/", page.renderHomePage);

// router.get('*', page.wrongAdress);

module.exports = router;
