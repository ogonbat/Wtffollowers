/**
 * Created by ogonbat.
 */
var app = angular.module("app",['ngRoute', 'mobile.controllers']);

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
            templateUrl: '/mobile/partials/home.html',
            controller: 'HomeController'
        });
        $routeProvider.when('/social', {
            templateUrl: '/mobile/partials/social.html',
            controller: 'SocialController'
        });
        $routeProvider.when('/payments', {
            templateUrl: '/mobile/partials/payments.html',
            controller: 'PaymentsController'
        });
    }
])

angular.bootstrap(document.getElementById("mobileContainer"),["app"]);