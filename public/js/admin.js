(function() {
  var socket = io.connect();

  socket.on('baseFeed', function(data) {
     $('<article class="feeditem" data-id="' +
      data.key.time +
      '"><a href="#" class="delete-post" data-id="' +
      data.key.time +
      '">Delete post</a><h4 class="feedhead">' +
      data.key.title +
      '</h4><p class="feedbody">' +
      data.value.text +
      '</p></article>'
     ).appendTo('section.content');

    $('.delete-post').click(function(e) {
      var id = $(this).data('id');
      var title = $(this).siblings('h4').text();
      console.log(id);
      socket.emit('deletePost', {
        postTitle: title, 
        postId: id
      });
      $(this).parent().fadeOut(500, function() {
        $(this).remove();
      });
    });
  
    socket.removeListener('baseFeed');
  });

})();
