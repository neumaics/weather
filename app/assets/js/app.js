(function(io) {
  var socket = io.connect();

  socket.emit('ready');

  angular.module('dash', [])
    .controller('temperatureController', ['$scope',
      function($scope) {
        $scope.entries = [];

        socket.on('update', function(data) {
          $scope.$apply(function() {
            $scope.entries.push(data);
          });
        });
      }]
    );
}(io));
