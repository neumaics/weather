// Server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config/local')

////
// Database setup
var mongoose = require('mongoose');
var uri = 'mongodb://' +
  '@' + config.mongo.host +
  ':' + config.mongo.port +
  '/' + config.mongo.database;

var opts = { user: config.mongo.user };

mongoose.connect(uri, opts);

////
//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

////
// Routes setup
var router = express.Router();

router.route('/temperature').
  post(function (req, res) {
    console.log('POST');
    res.send('Got a POST request');
  }).

  get(function(req, res) {
    console.log('GET');
    res.send('Got a GET request');
  });

app.use('/api', router);


////
//
var port = process.env.PORT || 8080;
app.listen(port);

console.log('running on port', port);
