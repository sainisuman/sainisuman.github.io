//Module
var weatherApp = angular.module("weatherApp", ['ngRoute', 'ngResource']);

//Routes
weatherApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })
        .when('/forecast', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        })
        .when('/forecast/:days', {
        templateUrl: 'pages/forecast.html',
        controller: 'forecastController'
        })
});

//Services
weatherApp.service('cityService', function () {
    this.city = 'New York, NY';
});

//Controller Home
weatherApp.controller('homeController', ['$scope', '$location','cityService', function ($scope, $location, cityService) {
    $scope.city = cityService.city;
    $scope.$watch('city', function () {
        cityService.city = $scope.city;
        
    });
    $scope.submit = function () {
        $location.path('/forecast');
    };
}]);

//Controller Forecast
weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams' ,'cityService', function ($scope, $resource, $routeParams, cityService) {
    $scope.city = cityService.city;

    $routeParams.days = $routeParams.days || 2;

    $scope.days = $routeParams.days;

    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=fe1886abceeebb5ddfa7b514d1964620", {
        callback: "JSON_CALLBACK"
    }, { get: { method: "JSONP" } });

    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $routeParams.days });

    $scope.convertToCentigrade = function (num) {
        return (num - 273).toFixed(2);
    };
}]);

//Custom Directives
weatherApp.directive('weatherReport', function () {
    return {
        strict: "E",
        templateUrl: 'directives/weatherReport.html',
        replace: true,
        scope: {
            weatherDay: "=",
            convertToCentigrade: "&",
            dateFormat: "@"
        }
    }
});