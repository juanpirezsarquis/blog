app = angular.module('BlogApp', ['ngRoute', 'ngResource', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl : 'partials/index.html',
		controller : 'PublicBlogCtrl'
	})
	.when('/login', {
		templateUrl : 'partials/login.html',
		controller : 'UserAdminCtrl'
	})
	.otherwise({
		redirectTo : '/'
	})
}]);