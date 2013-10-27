/**
 * Created by ogonbat.
 */
var app = angular.module("app",['ngRoute', 'wtff.controllers', 'wtff.directives','wtff.resources']);

app.config(['$routeProvider','$httpProvider',
    function($routeProvider, $httpProvider){
        /*
        Token for POST PUT and DELETE
         */
        authToken = $("meta[name=\"csrf-token\"]").attr("content");
        $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = authToken;
        /*
        routes
         */
        $routeProvider.when('/', {
            templateUrl: '/partials/home.html',
            controller: 'HomeController'
        });
        $routeProvider.when('/rules', {
            templateUrl: '/partials/rules/index.html',
            controller: 'RulesController'
        });
        $routeProvider.when('/rules/add', {
            templateUrl: '/partials/rules/add.html',
            controller: 'RulesAddController'
        });
        $routeProvider.when('/subscriptions', {
            templateUrl: '/partials/subscriptions/manage.html',
            controller: 'SubscriptionsController'
        });
    }
])

//app.run(function($rootScope){
//   $rootScope.random = Math.random();
//});
//app.config ($httpProvider){
//    authToken = $("meta[name=\"csrf-token\"]").attr("content");
//    $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = authToken;
//}

angular.bootstrap(document.getElementById("wtfContainer"),["app"]);