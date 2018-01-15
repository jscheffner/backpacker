const express = require('express');
const router = require('./src/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const methodOverride = require('method-override');
const cors = require('cors');
const morgan = require('morgan');
const { auth } = require('./src/middleware');
const chalk = require('chalk');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/backpacker', { useMongoClient: true })
  .catch(err => console.error(chalk.red(err)));

const app = express();
app.use(auth.init());
app.use(morgan('tiny'));
app.use(cors());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.json({ type: ['application/json', 'application/merge-patch+json'] }));
app.use('/', router);
app.use('/uploads', express.static('uploads'));
app.listen(3000, () => console.log(chalk.blue('App listening on port 3000!')));
app.use(errors());

module.exports = {
  app,
};
