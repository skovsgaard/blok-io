
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
var server = app.listen(process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.session({secret: 'totallyasecret'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Route and render the base path
app.get('/', function(req, res) {
  res.render('index', {title: 'Welcome tho!'});
});

// GET for the login-page
app.get('/login', function(req, res) {
  res.render('login', {
    title: 'Please log in',
    msg: ''
  });
});

// POST for the mock login
app.post('/login', function(req, res) {
  if (req.body.email === 'abcd@efg.hi' && req.body.pass === '#thistotallyworks') {
    req.session.auth = true;
    res.redirect('/admin');
  } else {
    req.session.auth = false;
    res.render('login', {
      title: 'Please log in.',
      msg: 'Incorrect email or password.'
    });
  }
})

// Route and render the admin interface
app.get('/admin', function(req, res) {
  if (req.session.auth) {
    res.render('admin', {title: 'the admin', msg: ''});
  } else {
    res.redirect('/login');
  }
});

// Make a new post from within the admin
app.post('/admin', function(req, res){
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

  if (req.body.postBody) {
    var val = {text: req.body.postBody};
  } else {
    var val = {text: ''};
  }

  postDB.put(key, val, function(err) {
    if (err) {
      console.log(err);
      res.render('admin', {
        title: 'the admin',
        msg: 'Post failed: ' + err
      });
    }

    
    io.sockets.emit('feedUpdate', {key: key, val: val});

      //io.sockets.emit('feedError', {data: err});

    res.render('admin', {
      title: 'the admin',
      msg: 'Post successful'
    });
  });
});

var io = require('socket.io').listen(server);

console.log('Express listening on port ' + (process.env.PORT || 3000));

io.on('connection', function(socket) {
  postDB.createReadStream()
    .on('data', function(data) {
      socket.emit('baseFeed', data);
    })
    .on('error', function(err) {
      socket.emit('feedError', err);
      console.log(err);
    })
});

process.on('exit', function(code) {
  console.log('Node process exiting with code: ' + code);

  postDB.close(function(err) {
    if (err) {
      return console.error('Something went wrong: ' + err);
    }
    console.log('Closing LevelDB store for posts.');
  })
})
