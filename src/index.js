const express = require('express');
const router = require('./routes');

const app = express();
app.use('/api/v0/', router);
app.listen(3000, () => console.log('App listening on port 3000!'));

module.exports = {
  app,
};
