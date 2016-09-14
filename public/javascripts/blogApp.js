app = angular.module('BlogApp', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap', 'ngSanitize',
	'textAngular', '720kb.socialshare', 'angular-storage', 'angular-jwt']);

app.config(['$routeProvider', '$httpProvider', 'jwtOptionsProvider', 
	function($routeProvider, $httpProvider, jwtOptionsProvider){

	$routeProvider
	.when('/', {
		templateUrl : 'partials/index.html',
		controller : 'IndexCtrl'
	})
	.when('/post',{
		templateUrl : 'partials/post.html',
		controller : 'PostCtrl'
	})
	.when('/post/:id',{
		templateUrl : 'partials/post.html',
		controller : 'PostCtrl'
	})
	.when('/blogadmin/login', {
		templateUrl : 'partials/login.html',
		controller : 'LoginCtrl'
	})		
	/* admin session */
	.when('/blogadmin/posts',{
		templateUrl : 'partials/postsList.html',
		controller : 'PostsForEditionCtrl',
		resolve: {
		    auth: ["$q", "userService", function($q, userService) {
		      	var isAuthenticated = userService.isAuthenticated();

		      	if (isAuthenticated) {
		        	return $q.when(isAuthenticated);
		      	} else {
		        	return $q.reject({ authenticated: false });
		      	}
		    }]
		}
	})
	.when('/blogadmin/newpost',{
		templateUrl : 'partials/newPost.html',
		controller : 'NewPostCtrl',
		resolve: {
		    auth: ["$q", "userService", function($q, userService) {
		      	var isAuthenticated = userService.isAuthenticated();

		      	if (isAuthenticated) {
		        	return $q.when(isAuthenticated);
		      	} else {
		        	return $q.reject({ authenticated: false });
		      	}
		    }]
		}

	})
	.when('/blogadmin/editpost',{
		templateUrl : 'partials/editPost.html',
		controller : 'PostEditionCtrl',
		resolve: {
		    auth: ["$q", "userService", function($q, userService) {
		      	var isAuthenticated = userService.isAuthenticated();

		      	if (isAuthenticated) {
		        	return $q.when(isAuthenticated);
		      	} else {
		        	return $q.reject({ authenticated: false });
		      	}
		    }]
		}
	})
	.when('/blogadmin/addblogger',{
		templateUrl : 'partials/addBlogger.html',
		controller : 'AddBloggerCtrl',
		resolve: {
		    auth: ["$q", "userService", function($q, userService) {
		      	var isAuthenticated = userService.isAuthenticated();

		      	if (isAuthenticated) {
		        	return $q.when(isAuthenticated);
		      	} else {
		        	return $q.reject({ authenticated: false });
		      	}
		    }]
		}
	})
	.when('/blogadmin/changepwd',{
		templateUrl : 'partials/changePass.html',
		controller : 'ChangePassCtrl',
		resolve: {
		    auth: ["$q", "userService", function($q, userService) {
		      	var isAuthenticated = userService.isAuthenticated();

		      	if (isAuthenticated) {
		        	return $q.when(isAuthenticated);
		      	} else {
		        	return $q.reject({ authenticated: false });
		      	}
		    }]
		}
	})
	.otherwise({
		redirectTo : '/'
	});

	// Set token in authorization header
	jwtOptionsProvider.config({
      tokenGetter: ['userService', function(userService) {
        return userService.token;
      }]
    });

    $httpProvider.interceptors.push('jwtInterceptor');
}]);

app.run(["$rootScope", "$location", 'previousPageService', function($rootScope, $location, previousPageService) {
  $rootScope.$on("$routeChangeSuccess", function(userInfo) {
  });

  $rootScope.$on("$routeChangeError", function(event, current, previous, eventObj) {
  	if (eventObj.authenticated === false) {
  		previousPageService.page = $location.path();
  		$location.path("/blogadmin/login");
    }
  });
}]);