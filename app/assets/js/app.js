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
            $scope.labels.push(data.timestamp);
            $scope.data[0].push(data.value);
          });
        });
      }]
    );
}(io));
