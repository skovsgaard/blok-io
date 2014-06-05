(function() {
  var socket = io.connect();

  socket.on('baseFeed', function(data) {
     $('<article class="feeditem" data-id="' +
      data.key.time +
      '"><button class="delete-post" data-id="' +
      data.key.time +
      '">Delete post</button><button class="edit-post" data-id="' +
      data.key.time +
      '">Edit post</button><h4 class="feedhead">' +
      data.key.title +
      '</h4><p class="feedbody">' +
      data.value.text +
      '</p></article>'
     ).appendTo('section.content');
  
    $('.delete-post').unbind('click');
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
  
    $('.edit-post').unbind('click');
    $('.edit-post').click(function(e) {
      var id = $(this).data('id');
      var title = $(this).siblings('h4').text();
      var oldText = $(this).siblings('p').text();
      console.log(id);
      
      $(this).parent().append(
        '<div class="editor">' +
        '<textarea>' +
        oldText +
        '</textarea><br/>' +
        '<button class="save-button">Save post</button>' +
        '<button class="cancel-button">Cancel</button>' +
        '</div>'
      );

      $('.cancel-button').unbind('click');
      $('.cancel-button').click(function(e) {
        $(this).parent().fadeOut(500, function() {
          $(this).remove();
        });
      });
      
      $('.save-button').unbind('click');
      $('.save-button').click(function(e) {
        var newText = $(this).siblings('textarea').val();
        var updateObj = {
          postTitle: title,
          postId: id,
          postContent: newText
        };
        socket.emit('updatePost', updateObj);
        $(this).parent().fadeOut(500, function() {
          $(this).remove();
        });
      });
    });
  
    socket.removeListener('baseFeed');
  });

})();
