var express = require('express');
var router = express.Router();
//var mongoosePaginate = require('mongoose-paginate');
var mongoose = require('mongoose');

/* GET all posts */
router.get('/all/:limit/:page', function(req, res) {
	Post = mongoose.model('Post');
  	Post.paginate( { public: true, slider: false, top: false}, 
		{ select: 'title image resume', sort: {date : -1}, limit: Number(req.params.limit),
			 page: Number(req.params.page) },
		function(err, posts) {
		return res.json(posts);
  	});
});

/* GET post with id :id */
router.get('/one/:id', function(req, res) {
	Post = mongoose.model('Post');
	Post.findOne({ _id: req.params.id })
	.select('title author image resume body date tags edited comments meta')
  	.exec(function(err, posts){
		res.json(posts);
	});
});

/* GET carousel posts */
router.get('/carousel', function(req, res) {
	Post = mongoose.model('Post');
  	Post.find({ public: true, slider: true, top: false }).select('title image resume')
  	.sort( {date: -1} ).exec(function(err, posts){
		res.json(posts);
	});
});

/* GET top posts */
router.get('/top', function(req, res) {
	Post = mongoose.model('Post');
  	Post.find({ public: true, slider: false, top: true }).select('title image resume')
  	.sort( {date: -1} ).exec(function(err, posts){
		res.json(posts);
	});
});

module.exports = router;