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
const config = require('config');

const dbUri = config.get('db.uri');
const port = config.get('server.port');
const format = config.get('log.format');

mongoose.Promise = Promise;
mongoose.connect(dbUri, { useMongoClient: true })
  .then(() => console.log(chalk.blue(`Connected to DB ${dbUri}`)))
  .catch(err => console.error(chalk.red(err)));

const app = express();
app.use(auth.init());
app.use(morgan(format));
app.use(cors());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.json({ type: ['application/json', 'application/merge-patch+json'] }));
app.use('/', router);
app.use('/uploads', express.static('uploads'));
app.listen(port, () => console.log(chalk.blue(`App listening on port ${port}!`)));
app.use(errors());

module.exports = {
  app,
};
