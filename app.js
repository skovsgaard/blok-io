
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var level = require('level');

// Data store connection to LevelDB
var postDB = level('./posts', {
  valueEncoding: 'json',
  keyEncoding: 'json'
}, function(err, db) {
  if (err) {
    console.error('Something terrible happened: ');
    throw err;
  }
});

var app = express();
var server = app.listen(3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Route and render the base path
app.get('/', function(req, res) {
  res.render('index', {title:'Welcome tho!'});
});

// Route and render the admin interface
app.get('/admin', function(req, res) {
  res.render('admin', {title: 'the admin'});
});

// Make a new post from within the admin
app.post('/postpost', function(req, res){
  if (req.body.postTitle) {
    var key = {
      title: req.body.postTitle,
      time: Date.now()
    };
  } else {
    var key = {
      title: 'no title',
      time: Date.now()
    }
  }

  if (req.body.postBody) var val = {text: req.body.postBody};

  res.end("The data to be written is: \n" +
          JSON.stringify(key, null, '  ') +
          ": " + 
          JSON.stringify(val, null, '  ')
         );
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
  socket.emit('news', {sup: 'heyoo'});
});

console.log('Express listening on port 3000');
