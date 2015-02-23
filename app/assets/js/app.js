(function(io) {
  var socket = io();

  socket.emit('ready');

  socket.on('update', function(data) {
    console.log(data);
  });

}(io));
