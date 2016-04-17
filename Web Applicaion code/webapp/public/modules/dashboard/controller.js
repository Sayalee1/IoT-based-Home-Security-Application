var sensor = angular.module('app', ['ngSanitize', 'toggle-switch', 'ui-notification']);

sensor.controller('mainController', function ($scope, $http, Notification, $interval) {

        var num = 0.0;
        var n;      
        $scope.num = num;
        $scope.count = 0;
        $scope.prevval = 0;
        $scope.distData = 0;
        $scope.lightData = 0;
        $scope.notifications = [];
        //$scope.switchStatus = true;
        $scope.thrs = new Threshold(n);

        $scope.init = function () {
          $http.get('/api/currentState')
          .success(function(response) {
          console.log(response);
          $scope.currentSt = response;
          $scope.switchStatus = $scope.currentSt.SensorState;
          $scope.thrs = new Threshold($scope.currentSt.ThresholdVal);
          console.log($scope.currentSt.SensorState);
        })
        .error(function(data) {
            console.log('Error: ' + data);
          });
        }
        $scope.init();

        $scope.sendVal = function() {
          console.log("thrs value is:" + JSON.stringify($scope.thrs));
          $http.post('/api/threshold', $scope.thrs)
            .success(function(data) {
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        };

        $scope.sendState = function(val){
          //console.log(val);
          var b = {"btnState" : val};
          $http.post('/api/button', b)
            .success(function(data) {
                $scope.button = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }


        $scope.count = 0;
        $scope.thsrNotification = function(){
        $http.get('/api/notification')
        .success(function(response) {

          console.log("Notification value");
          console.log(JSON.stringify(response));
          $scope.count = response.NotifyCount;
          $scope.notifications = response.NotifyVal;
          //}
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
        }
        $interval($scope.thsrNotification, 1000);

        $scope.clearNotifications = function(){
            //console.log("Notification data");
           for (var i=0; i<$scope.notifications.length; i++){
            Notification.success($scope.notifications[i]);
            console.log("Inside notifications : " + $scope.notifications[i]);
            }
          $http.get('/api/notificationSet')
            .success(function(response) {
                console.log("Reset the notification counter successfully");
            })
            .error(function(response) {
                console.log('Error: ' + response);
            });
        };

      $scope.sensorCall = function(){
        $http.get('/api/data')
        .success(function(response) {
          //console.log("I have met the client")
          $scope.sensorData = response;
           $scope.distData = ($scope.sensorData.Distance / 100).toFixed(2);
           //console.log("Light data " + $scope.sensorData.Light)
          if($scope.sensorData.Light < 255 && $scope.sensorData.Light >=0){
            $scope.lightData = ((255 - $scope.sensorData.Light) * 100 / 255).toFixed(2);
           }
           else if($scope.sensorData.Light > 255 || $scope.sensorData.Light < 0) {
            $scope.lightData = 0;
          }               
        })
        .error(function(data) {
            console.log('Error: ' + data);
          });
      };
      $interval($scope.sensorCall, 1000);

  });
    
    function Threshold(current) {
    var thrs = current;

    this.__defineGetter__("thrs", function () {
        return thrs;
    });

    this.__defineSetter__("thrs", function (val) {        
        val = parseInt(val);
        thrs = val;
    });
  }