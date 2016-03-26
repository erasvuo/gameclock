'use strict';

angular.module('pelikelloApp', ['ui.bootstrap','ngStorage', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

    // default route
    $urlRouterProvider.otherwise("/");

    // ui router states
    $stateProvider
        .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'views/header.html'
                },
                'content': {
                    templateUrl : 'views/content.html'
                },
                'footer': {
                    templateUrl : 'views/footer.html'
                }
            }
        })


        // route for the aboutus page
        .state('app.setup', {
            url:'setup',
            views: {
                'content@': {
                    templateUrl : 'views/setup.html',
                    controller  : 'SetupController'                    
                }
            }
        })


        // route for the aboutus page
        .state('app.control', {
            url:'control',
            views: {
                'content@': {
                    templateUrl : 'views/control.html',
                    controller  : 'CtrlController'                                     
                }
            }
        })

});
