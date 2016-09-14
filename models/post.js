var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var postSchema = new Schema({
  title:  String,
  author: String,
  image: String,
  resume: String,
  body:   String,
  date: { type: Date, default: Date.now },
  public: Boolean,
  slider: Boolean,
  top: Boolean,
  tags: [Schema.Types.ObjectId],
  edited: [{ author: String, date: Date }],
  comments: [{ email: String, body: String, date: Date }],
  meta: {
    votes: Number,
    favs:  Number
  }
});

postSchema.plugin(mongoosePaginate);

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
