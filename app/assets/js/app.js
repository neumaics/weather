(function(io) {
  var socket = io.connect();

  socket.emit('ready');

  angular.module('dash', ['chart.js'])
    .controller('temperatureController', ['$scope',
      function($scope) {
        // $scope.entries = [];
        $scope.series = ['Temperature °C'];
        $scope.labels = [];
        $scope.data = [[]];

        socket.on('update', function(data) {
          $scope.$apply(function() {
            // $scope.entries.push(data);
            if ($scope.lables.length >= 100) {
              $scope.lables.splice(0, 1);
              $scope.data[0].splice(0, 1);
            }
            
            $scope.labels.push(data.timestamp);
            $scope.data[0].push(data.value);
          });
        });
      }]
    );
}(io));
