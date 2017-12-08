const express = require('express');
const users = require('./users');
const locations = require('./locations');

const router = express.Router();
router.use('/users', users);
router.use('/locations', locations);

module.exports = router;
