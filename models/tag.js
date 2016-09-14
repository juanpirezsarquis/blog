var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
  name: String,
  posts : [Schema.Types.ObjectId]
});

var Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
