const express = require('express');
const router = require('./src/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

mongoose.connect('mongodb://localhost/backpacker', { useMongoClient: true });
mongoose.Promise = Promise;

const app = express();
app.use(bodyParser.json());
app.use('/api/v0/', router);
app.use('/uploads', express.static('uploads'));
app.listen(3000, () => console.log('App listening on port 3000!'));
app.use(errors());

module.exports = {
  app,
};
