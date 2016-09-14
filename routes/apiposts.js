var express = require('express');
var apiposts = express.Router();
var mongoose = require('mongoose');

/* GET all posts */
apiposts.get('/all4edit/:limit/:page', function(req, res) {
	Post = mongoose.model('Post');
  	Post.paginate( {}, 
		{ select: 'title image resume date author public slider top edited', sort: {date : -1}, limit: Number(req.params.limit),
			 page: Number(req.params.page) },
		function(err, posts) {
		return res.json(posts);
  	});
});

/* Add a new post */
apiposts.post('/', function(req, res){
	var title = req.body.title;
    var author = req.decoded.user.username;
    var image = req.body.image;
	var resume = req.body.resume;
	var body = req.body.body;
	var public = req.body.public;
	var slider = req.body.slider;
	var top = req.body.top;
  	var tags = req.body.tags;

	if (title == null || title === ""){
		res.json("Title is required");
	}
	else if (resume == null || resume === ""){
		res.json("Resume is required");
	}
	
	if (public == null || public === ""){
		public = false;
	}
	if (slider == null || slider === ""){
		slider = false;
	}
	if (top == null || top === ""){
		top = false;
	}
	
	var postJson = {
		title : title,
	    author : author,
	    image : image,
		resume : resume,
		body : body,
		public : public,
		slider : slider,
		top : top,
		tags : tags
	}
	Post = mongoose.model('Post');
	Post.create( postJson, function(err, post){
		//if (err) throw err;
		res.json(post);
	});
});

/* GET one post for edition */
apiposts.get('/:id', function(req, res){

	Post = mongoose.model('Post');
	Post.findById( req.params.id ,
        function(err, post) {
			res.json(post);
        }
    );

});

/* UPDATE post with :id id */
apiposts.put('/:id', function(req, res){

	var title = req.body.title;
    var image = req.body.image;
	var resume = req.body.resume;
	var body = req.body.body;
	var public = req.body.public;
	var slider = req.body.slider;
	var top = req.body.top;
	
	//var tags = req.body.tags;	
	
	if (title == null || title === ""){
		res.json("Title is required");
	}
	else if (resume == null || resume === ""){
		res.json("Resume is required");
	}

	Post = mongoose.model('Post');
	Post.findByIdAndUpdate( req.params.id ,
        {
        	$set: {
        		title : title,
			    image : image,
				resume : resume,
				body : body,
				public : public,
				slider : slider,
				top : top,
			},
        	$addToSet: { edited: { author: req.decoded.user.username, date: new Date()}},
        	//$addToSet: { tags: { $each : { tags }}}
        },
        {safe: true, upsert: true, new : true},
        function(err, post) {
			if(err) {
				console.log(err.message);
  			} else {
				res.json(post);
			}

        }
    );
});

/* DELETE post with :id id */
apiposts.delete('/:id', function(req, res){

	Post = mongoose.model('Post');
	Post.remove( { _id: req.params.id },
        function(err, post) {
			if(err) throw err;

			res.json(post);
        }
    );
});

module.exports = apiposts;