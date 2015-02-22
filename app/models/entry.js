var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = new Schema({
  timestamp: Date,
  value: Number,
  type: String
});

module.exports = mongoose.model('Entry', EntrySchema);
