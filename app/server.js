// Server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.
  post('/temperature', function (req, res) {
    res.send('Got a POST request');
  }).

  get('/temperature', function(req, res) {
    res.send('Got a GET request');
  });

app.use('/api', router);

app.listen(port);
console.log('running on port ', port);
