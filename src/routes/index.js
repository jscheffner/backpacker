const express = require('express');
const users = require('./users');
const locations = require('./locations');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const spec = YAML.load('./swagger.yml');

const router = express.Router();
router.use('/users', users);
router.use('/locations', locations);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

module.exports = router;
