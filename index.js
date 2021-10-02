const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const users = require('./routes/users');

app.use('/api', users);

app.listen(5000, () => {
  console.log('API running @ localhost:5000');
});
