(function() {
  var socket = io.connect('http://localhost');
  socket.on('news', function(data) {
    for (var x in data) {
      $('<p>' + x + ': ' + data[x] + '</p>').insertAfter('#topP');
    }
    socket.emit('my other event', {my: 'data'});
  });
})();
