var Post = require('../models/post');
var bodyParser = require('body-parser');

module.exports = function(app) {

	app.get('/posts/:author', function(req,res){
		Post.find( { author: req.params.author }, function(err, posts){
			if(err) throw err;

			res.send(posts);
		} );
	});

	app.get('/posts/:id', function(req,res){
		Post.findById( { _id: req.params.id }, function(err, post){
			if(err) throw err;

			res.send(post);
		} );
	});

	app.get('/posts/slider', function(req,res){
		Post.find( { slider: true }, function(err, posts){
			if(err) throw err;

			res.send(posts);
		} );
	});

}