'use strict';

/**
 * @ngdoc overview
 * @name tiquetmeApp
 * @description
 * # tiquetmeApp
 *
 * Main module of the application.
 */
angular
  .module('tiquetmeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'lbServices'
  ])
  .config(function ($routeProvider, LoopBackResourceProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/privacy', {
        templateUrl: 'views/privacy.html',
        controller: 'PrivacyCtrl'
      })
      .when('/faq', {
        templateUrl: 'views/faq.html',
        controller: 'FaqCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    //LoopBackResourceProvider.setUrlBase(ENV.apiEndpoint);
  });
