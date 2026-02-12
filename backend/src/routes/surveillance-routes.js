const express = require('express')
const router = express.Router();
const isLoggedin = require("../middleware/authMiddleware");
const {startSurveillance} = require('../controller/surveillance-controller')

router.post("/start", isLoggedin, startSurveillance);

module.exports = router;