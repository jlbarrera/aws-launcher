'use strict';

var app = angular.module('aws', ['ngRoute', 'appServices'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'instances.html',
            controller: 'IndexCtrl'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }]) // End-config

    .run(['$rootScope', '$location', function ($rootScope, $location) {        
        if ($rootScope.access_token == null) {
            $location.path("/login");
        }
    }]) // End-run

    .controller('LoginCtrl', ['$scope', '$location', '$routeParams', 'EC2', function ($scope, $location, $routeParams, EC2) {
        if ($routeParams.access_token != null) {
            $location.path("/");
        }
    }]) // End-LoginCtrl

    .controller('IndexCtrl', ['$scope', '$rootScope', '$location', '$interval', '$routeParams', 'EC2', function ($scope, $rootScope, $location, $interval, $routeParams, EC2) {

        $scope.ec2_service = new EC2();

        if ($routeParams.access_token) { // Check if logged in

            // initialize scope
            $rootScope.loggedIn = true
            $rootScope.canLaunchInstance = false; // only one instance allowed (aws free tier limits)            
            $scope.updated_instances_ids = []
            $scope.instances = []            

            // AWS configuration
            AWS.config.region = 'eu-west-1';
            AWS.config.credentials = new AWS.WebIdentityCredentials({
                RoleArn: 'ROLE',
                ProviderId: 'www.amazon.com',
                WebIdentityToken: $routeParams.access_token
            });

            // Update instance status each 5 seg            
            var update_from_aws = $interval(function () {

                if (!$rootScope.loggedIn) $interval.cancel(update_from_aws); // check if logged in

                // Get all instances
                $scope.ec2_service.getInstances(function success(response) {                    
                    var launch = true;
                    $scope.updated_instances_ids = []
                    for (var i = 0; i < response.length; i++) {                                                
                        $scope.updated_instances_ids.push(response[i].InstanceId);

                        // Check if exists any instance already deployed (different of terminated)
                        if (response[i].InstanceState.Code != 48) {
                            launch = false;
                        }
                    }
                    console.log($scope.updated_instances_ids);

                    $rootScope.canLaunchInstance = launch;

                    // Get full instance info                    
                    $scope.ec2_service.instanceDetail($scope.updated_instances_ids, function success(data) {
                        console.log(data);
                        $scope.instances = []
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < data[i].Instances.length; j++) {                                
                                $scope.instances.push(data[i].Instances[j]);
                            }
                        }
                    });
                }, function fail(response) {
                    console.log("error");
                });
            }, 5000); // End-update_from_aws



        } // End-if-$routeParams.access_token

        /**
         * Stop an instance
         */
        $scope.stop = function (instance) {

            if (instance.State.Code != 80) { // Check if status different of "stopped"
                $scope.ec2_service.stopInstance(instance.InstanceId, function success(response) {                    
                    return true;
                });                
            }

        }

        /**
         * Start an instance
         */
        $scope.start = function (instance) {
            
            if (instance.State.Code == 80) { // Check if status is "stopped"
                $scope.ec2_service.startInstance(instance.InstanceId, function success(response) {                    
                    return true;
                });
            }
                                                
        }

        /**
         * Terminate an instance
         */
        $scope.terminate = function (instance) {
            if (instance.State.Code == 80 || instance.State.Code == 16) { // Check if status is "started" or "stopped"
                $scope.ec2_service.terminateInstance(instance.InstanceId, function success(response) {                    
                    return true;
                });
            }
        }

        /**
         * Launch a new Wordpress instance
         */
        $scope.launchInstance = function () {
            var launch = true;

            if ($scope.instances) {
                for (var i = 0; i < $scope.instances.length; i++) {
                    if ($scope.instances[i].State.Code != 48) { // Check if exists any instance already deployed (different of terminated)
                        launch = false;
                    }
                }
            }

            if (launch) {
                $scope.ec2_service.launchInstance(function success(response) {
                    console.log("Created instance", response.Instances[0].InstanceId);
                    return true;
                });                
            }

            return false;

        }

        /**
         * Set the Start button name
         */
        $scope.start_button_name = function (instance) {
            if (instance.State.Code == 0) {
                return "Starting...";
            } else {
                return "Start";
            }
        }

        /**
         * Set the stop button name
         */
        $scope.stop_button_name = function (instance) {
            if (instance.State.Code == 64) {
                return "Stopping...";
            } else {
                return "Stop";
            }
        }

        /**
         * Set the terminate button name
         */
        $scope.terminate_button_name = function (instance) {
            if (instance.State.Code == 32) {
                return "shutting-down...";
            } else {
                return "Terminate";
            }
        }

        /**
         * Aws logout
         */
        $scope.aws_logout = function () {
            $rootScope.loggedIn = false;                        
            update_from_aws = undefined;            
            amazon.Login.logout();            
        }

    }]) // End-IndexCtrl