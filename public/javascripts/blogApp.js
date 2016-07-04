app = angular.module('blogApp', ['ngRoute', 'ngResource', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl : 'partials/index.html',
		controller : 'StatsAdminCtrl'
	})
	.when('/login', {
		templateUrl : 'partials/login.html',
		controller : 'UserAdminCtrl'
	})
	.otherwise({
		redirectTo : '/'
	})
}]);