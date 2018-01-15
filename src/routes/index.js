const express = require('express');
const users = require('./users');
const locations = require('./locations');
const { auth } = require('../middleware');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const spec = YAML.load('./swagger.yml');

const router = express.Router();
router.use('/api/v0/users', users);
router.use('/api/v0/locations', locations);
router.use('/api/v0/docs', swaggerUi.serve, swaggerUi.setup(spec));
router.get('/auth/admin', auth.authenticate(['basic']), (req, res) => res.sendStatus(200));

module.exports = router;
