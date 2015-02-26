var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = new Schema({
  timestamp: Date,
  values: { },
  type: String,
  num_entries: Number,
  sum_entries: Number
});

EntrySchema.statics.getBlank = function (timestamp, type) {
  return {
    timestamp: timestamp,
    values: this.minuteList(),
    type: type,
    num_entries: 0,
    sum_entries: 0
  }
}

EntrySchema.statics.minuteList = function()  {
  var ret = {
    sum: 0
  }

  for (var i = 0; i < 60; i++) {
    ret[i] = this.secondList();
  }

  return ret;
};

EntrySchema.statics.secondList = function() {
  var ret = {
    sum: 0
  }

  for (var i = 0; i < 60; i++) {
    ret[i] = null;
  }

  return ret;
};

module.exports = mongoose.model('Entry', EntrySchema);
