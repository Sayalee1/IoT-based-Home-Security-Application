      angular.module('app', ['ngSanitize', 'toggle-switch', 'ui-notification']);
      angular.module('login', []);
      angular.module('main', [
    'login',
    'app',
    'ngRoute',
    'ngCookies'
])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'loginController',
            templateUrl: 'modules/login/views/login.html',
            hideMenus: true
        })
 
        .when('/', {
            controller: 'mainController',
            templateUrl: 'modules/dashboard/views/dashboard.html'
        })
 
        .otherwise({ redirectTo: '/login' });
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['login'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);
