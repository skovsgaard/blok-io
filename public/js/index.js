(function() {
  var socket = io.connect('http://blog-io.herokuapp.com');

  socket.on('baseFeed', function(data) {
    //for (var x in data) {
      //var displayObject = data[x];
      $('<div class="feedItem"><p>' +
        data.key.title +
        ': ' +
        data.value.text +
        '</p></div>'
       ).insertAfter('#main-header');
    //}
    socket.removeListener('baseFeed');
  });

  socket.on('feedUpdate', function(data) {
    $('<div class="feedItem"><p>' +
      data.key.title +
      ': ' +
      data.val.text + 
      '</p></div>'
     ).insertBefore('.feedItem');
    
    console.log(JSON.stringify(data, null, '  '));
  });

})();
