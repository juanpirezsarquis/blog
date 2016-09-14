// post selected to view or to edit
app.service('postSelectedService', function(){
	this.postId = null;
});

// service with the previous page before login required
app.service('previousPageService', function(){
	this.page = null;
});

// user administration
app.service('userService', ['$resource', 'store', 'jwtHelper',
	function($resource, store, jwtHelper){
	
	// trick to pass this attributes to the other functions
	var self = this;

	this.logout = function(){
		self.username = null;
		self.token = null;
		store.remove('pirexblog_username');
		store.remove('pirexblog_token');
	}

	this.isAuthenticated = function(){
		if(self.token){
			if(jwtHelper.isTokenExpired(self.token)){
				self.logout();
				return false;
			} else{
				return true;
			}
		} else {
			return false;
		}
	}

	this.username = store.get('pirexblog_username');
	this.token = store.get('pirexblog_token');
	// when refreshing the page
	if (this.token){
		this.isAuthenticated();
	}

	this.login = function(username, token){
    	store.set('pirexblog_username', username);
    	store.set('pirexblog_token', token);

        self.username = username;
        self.token = token;
    }

}]);
