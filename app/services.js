'use strict';

var appServices = angular.module('appServices', []);

appServices.factory('EC2', ['$http', function ($http) {

    function EC2() {
    };

    EC2.prototype = {
        getInstances: function (success, fail) {

            var ec2 = new AWS.EC2();

            var params = {
                IncludeAllInstances: true
            };
            ec2.describeInstanceStatus(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else success(data.InstanceStatuses); // successful response                
            });
        },
        stopInstance: function (instance, success, fail) {

            var ec2 = new AWS.EC2();

            var params = {
                InstanceIds: [instance]
            };

            ec2.stopInstances(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
            });
        },
        startInstance: function (instance, success, fail) {

            var ec2 = new AWS.EC2();

            var params = {
                InstanceIds: [instance]
            };

            ec2.startInstances(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
            });
        },
        terminateInstance: function (instance, success, fail) {

            var ec2 = new AWS.EC2();

            var params = {
                InstanceIds: [instance]
            };

            ec2.terminateInstances(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
            });
        },
        launchInstance: function (success, fail) {
            var ec2 = new AWS.EC2();

            var params = {
                ImageId: 'ami-917d10e2', // Wordpress Bitnami
                InstanceType: 't2.micro',
                SecurityGroupIds: ['sg-6972430e'],
                //NetworkInterfaces: [{DeviceIndex:0, SubnetId: 'vpc-66ab2e02', AssociatePublicIpAddress:true, Groups: ['sg-6972430e']}],
                KeyName: 'wordpress-aws',
                MinCount: 1, MaxCount: 1
            };

            ec2.runInstances(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else success(data);
            });
        },
        instanceDetail: function (instanceIds, success, fail) {
            var ec2 = new AWS.EC2();
            
            var params = {
                InstanceIds: instanceIds,
            };
            ec2.describeInstances(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else success(data.Reservations); // successful response                
            });
        }
    };
    return EC2;
}])  