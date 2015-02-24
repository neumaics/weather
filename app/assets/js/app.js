(function(io) {
  var socket = io.connect();

  socket.emit('ready');

  angular.module('dash', ['chart.js'])
    .controller('temperatureController', ['$scope',
      function($scope) {
        $scope.series = ['Temperature °C'];
        $scope.labels = [];
        $scope.data = [[]];

        socket.on('update', function(data) {
          $scope.$apply(function() {

            if ($scope.labels.length >= 100) {
              $scope.labels.splice(0, 1);
              $scope.data[0].splice(0, 1);
            }

            $scope.labels.push(data.timestamp);
            $scope.data[0].push(data.value);
          });
        });
      }]
    );
}(io));
