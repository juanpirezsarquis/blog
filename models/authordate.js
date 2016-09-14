var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorDateSchema = new Schema(
  /*author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }*/
  author: String,
  date: { type: Date, default: Date.now },
});

var AuthorDate = mongoose.model('AuthorDate', authorDateSchema);

module.exports = AuthorDate;
