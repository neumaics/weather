// Server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config/local');
var moment = require('moment');

var Entry = require('./models/entry');

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
    var entry = new Entry();

    entry.timestamp = moment.utc(req.body.timestamp);
    entry.value = req.body.value;
    entry.type = 'temperature';

    entry.save(function(err, entry) {
      if (err)
        res.send(err);

      res.json(entry);
    });
  }).

  get(function(req, res) {
    res.send('Got a GET request');
  });

app.use('/api', router);


////
//
var port = process.env.PORT || 8080;
app.listen(port);

console.log('running on port', port);
