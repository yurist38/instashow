// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var instashow = angular.module('starter', ['ionic']);

instashow.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

instashow.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('settings', {
    url: '/',
    templateUrl: 'settings.html',
    controller: 'SettingsCtrl'
  })
  .state('gallery', {
    url: '/gallery',
    templateUrl: 'gallery.html',
    controller: 'GalleryCtrl'
  });
  $urlRouterProvider.otherwise("/");
});

instashow.factory('InstaFlow', function($http) {
    return true;
});

instashow.controller('SettingsCtrl', function($scope, $http, InstaFlow) {
    $scope.settings = {
        token: '',
        tag: '',
        updatePeriod: 30
    }
    $scope.saveSettings = function() {
        localStorage.instaToken = $scope.settings.token;
        localStorage.instaTag = $scope.settings.tag;
        localStorage.instaPeriod = $scope.settings.updatePeriod;
    }
});

instashow.controller('GalleryCtrl', function($scope, $http, InstaFlow) {

    var contentHeight = $('.gallery-content').height();
    var contentWidth = $('.gallery-content').width();

    var widthActive = contentHeight * 1.75;
    $('.row-main').css('width', widthActive);

    $scope.settings = {
        token: localStorage.instaToken,
        tag: localStorage.instaTag,
        updatePeriod: parseInt(localStorage.instaPeriod)
    }

    var MAIN_URL = "https://api.instagram.com/v1/tags/";
    var request_url = MAIN_URL + $scope.settings.tag +
        "/media/recent?access_token=" + $scope.settings.token +
        '&callback=JSON_CALLBACK&count=4';

    $scope.getFresh = function() {
        var instaResponse = $http.jsonp(request_url);

        instaResponse.then(function(response) {
            $scope.instaData = response.data.data;
        });
        instaResponse.error(function(data, status, headers, config) {
            alert("Sorry! Can not connect with server... Try later.");
        });
    }

    $scope.getFresh();
    var refresh_loop = setInterval($scope.getFresh, $scope.settings.updatePeriod*1000);
});
