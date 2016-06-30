var Post = require('../models/post');
var bodyParser = require('body-parser');

module.exports = function(app) {

	app.get('/admin/api/posts/:id', function(req,res){
		Post.findById( { _id: req.params.id }, function(err, post){
			if(err) throw err;

			res.send(post);
		} );
	});

}