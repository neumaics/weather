// Server
var express = require('express.io');
var app = express();
app.http().io();

var bodyParser = require('body-parser');
var config = require('./config/local');
var moment = require('moment');
var round = require('round');

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
});

app.io.route('temperature', {
  log: function(req) {
    var utc = moment.utc(req.body.timestamp);
    var second = utc.second();
    var minute = utc.minute();
    var docTs = utc.millisecond(0).second(0).minute(0);

    var query = Entry.findOne({ timestamp: docTs }, function(err, entry) {
      if (err) throw err;

      if(entry) {
        var value = round(req.body.value, 0.005);

        entry.set('values.' + minute + '.' + second, value);

        entry.save(function(err, entry) {
          if (err) throw err;
          console.log(entry.values[minute][second]);
          console.log(minute, second);
        });
      } else {
        var e = Entry.getBlank(docTs, 'temperature');
        e.values[minute][second] = round(req.body.value, 0.005);

        var newEntry = new Entry(e);

        newEntry.save(function(err, entry) {
          if (err) throw err;
        });
      }
    });

    req.io.respond();
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
