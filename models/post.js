var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title:  String,
  author: String,
  resume: String,
  body:   String,
  date: { type: Date, default: Date.now },
  public: Boolean,
  slider: Boolean,
  tags: [ _id : Schema.Types.ObjectId],
  edited: [author: String, date: Date],
  comments: [{ email: String, body: String, date: Date }],
  meta: {
    votes: Number,
    favs:  Number
  }
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
