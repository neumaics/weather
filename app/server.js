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
    var value = round(req.body.value, 0.005);

    var query = Entry.findOne({ timestamp: docTs }, function(err, entry) {
      if (err) throw err;

      if(entry) {
        entry.set('values.' + minute + '.' + second, value);

        var newHourSamples = entry.samples + 1;
        entry.set('samples', newHourSamples);

        var newHourAverage = (entry.average + value) / 2;
        entry.set('average', round(newHourAverage, 0.005));

        var newMinuteSamples = entry.values[minute].samples + 1;
        entry.set('values.' + minute + '.samples', newMinuteSamples);

        if (newMinuteSamples === 1) {
          entry.set('values.' + minute + '.average', value);
        } else {
          var newMinuteAverage = (entry.values[minute].average + value) / 2;
          entry.set('values.' + minute + '.average', round(newMinuteAverage, 0.005));
        }

        entry.save(function(err, entry) {
          if (err) throw err;
        });
      } else {
        var e = Entry.getBlank(docTs, 'temperature');
        e.values[minute][second] = value;
        e.samples = 1;
        e.average = value;
        e.values[minute].samples = 1;
        e.values[minute].average = value;

        var newEntry = new Entry(e);

        newEntry.save(function(err, entry) {
          if (err) throw err;
        });
      }
    });

    req.io.respond();
  },
  second: function(req) {
    req.io.respond();
  },
  minute: function(req) {
    req.io.respond();
  },
  hour: function(req) {
    var from = req.data.from;
    var to = req.data.to;

    Entry.find({ type: 'temperature', timestamp: { $lte: from, $gte: to }}, function(err, entries) {
      if (err) {
        req.io.emit(err);
      }

      req.io.respond(entries);
    });
  }
});

app.post('/api/temperature', function (req, res) {
  req.io.route('temperature:log');
});

app.get('/api/temperature', function(req, res) {
  switch (req.body.resolution) {
    case 'second':
      req.io.route('temperature:second'); break;
    case 'minute':
      req.io.route('temperature:minute'); break;
    case 'hour':
      req.io.route('temperature:hour'); break;
  }
});

app.get('/api/temperature/hour/', function (req, res) {
  Entry.find()
    .where('type').equals('temperature')
    .where('timestamp')
    .gte(req.query.from)
    .lte(req.query.to || new Date())
    .exec(function(err, entries) {
      if (err) { res.send(err); }

      res.send(entries.map(
        function (ele) {
          return {
            timestamp: ele.timestamp,
            value: ele.average
          };
        }
      ));
    });
});

app.get('/api/temperature/minute/', function(req, res) {
  var o = {
    query: { timestamp: { $gte: new Date(req.query.from), $lte: new Date(req.query.to) }},
    map: function () { emit(this.timestamp, {
      average: this.average,
      values: this.values
    }) },
    reduce: function (k, vals) { return vals.values.length },
    finalize: function(k, reducedVal) {
      var vals = [];

      for (var key in reducedVal.values) {
        vals.push({ m: key, value: reducedVal.values[key].average});
      }

      return {
        timestamp: k,
        values: vals
      };
    }
  };

  Entry.mapReduce(o, function(err, results) {
    if (err) { res.send(err) }
    else { res.send(results.map(function (e) {
      return { timestamp: e.value.timestamp, values: e.value.values };
    })); }
  })
});

app.get('/api/temperature/second/', function(req, res) {

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
