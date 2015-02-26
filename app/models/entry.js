var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = new Schema({
  timestamp: Date,
  values: { },
  type: String,
  samples: Number,
  average: Number
});

EntrySchema.statics.getBlank = function (timestamp, type) {
  return {
    timestamp: timestamp,
    values: this.minuteList(),
    type: type,
    samples: 0,
    average: 0
  }
}

EntrySchema.statics.minuteList = function()  {
  var ret = { };

  for (var i = 0; i < 60; i++) {
    ret[i] = this.secondList();
  }

  return ret;
};

EntrySchema.statics.secondList = function() {
  var ret = {
    samples: 0,
    average: 0
  };

  for (var i = 0; i < 60; i++) {
    ret[i] = null;
  }

  return ret;
};

module.exports = mongoose.model('Entry', EntrySchema);
