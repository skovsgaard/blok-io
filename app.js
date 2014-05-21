
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = app.listen(3000);
//server.listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});

// all environments
//app.set('port', process.env.PORT || 3000);
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

app.get('/', function(req, res) {
  res.render('index', {title:'Welcome tho!'});
});

app.get('/admin', function(req, res) {
  res.render('admin', {title: 'the admin'});
  io.socket.removeAllListeners('connection');
});

app.post('/postpost', function(req, res){
  res.send("GREAT SUCCESS!\n" + req.body.postBody);
})

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
  socket.emit('news', {sup: 'heyoo'});
});

console.log('Express listening on port 3000');
