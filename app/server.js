// Server
var express = require('express.io');
var app = express();
app.http().io();

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
app.io.route('ready', function(req) {
  console.log('hello');
  // req.io.broadcast('new visitor');
});

app.io.route('temperature', {
  log: function(req) {
    var entry = new Entry();

    entry.timestamp = moment.utc(req.body.timestamp);
    entry.value = req.body.value;
    entry.type = 'temperature';

    entry.save(function(err, entry) {
      if (err)
        res.send(err);

      req.io.broadcast('update', {
        timestamp: entry.timestamp,
        value: entry.value,
        type: entry.type
      });

      // res.json(entry);
    });

  }
});

app.post('/api/temperature', function (req, res) {
  req.io.route('temperature:log');
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/app'));

////
//
var port = process.env.PORT || 8080;
app.listen(port);

console.log('running on port', port);
