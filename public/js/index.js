
/**
 * Define onready behavior
 */

(function() {
  var socket = io.connect();

  socket.on('baseFeed', function(data) {
    $('<article class="feeditem" data-id="' +
      data.key.time +
      '"><h4 class="feedhead">' +
      data.key.title +
      '</h4><p class="feedbody">' +
      data.value.text +
      '</p></article>'
     ).prependTo('section.content');
    socket.removeListener('baseFeed');
  });

  socket.on('feedUpdate', function(data) {
    $('<article class="feeditem" data-id="' +
      data.key.time +
      '"><h4 class="feedhead">' +
      data.key.title +
      '</h4><p class="feedbody">' +
      data.val.text + 
      '</p>' +
      '</article>'
     ).prependTo('section.content');
    
    console.log(JSON.stringify(data, null, '  '));
  });

})();


