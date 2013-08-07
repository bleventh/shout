var express   = require('express'),
    shoutsAPI = require('./controllers/shouts.js'),
    authAPI   = require('./controllers/auth.js'),
    userAPI   = require('./controllers/user.js'),
    mysql     = require('mysql'),
    voteAPI   = require('./controllers/amp.js');
var app = express();

/**
 * MiddleWare
 */
var connection = mysql.createConnection({
  host     : 'localhost:3306',
  user     : 'escher',
  password : 'blacapps69'
});

connection.connect(function(err) {
    if (err) {
        console.log('db error: ' + err);
    }
});

app.use(function(req, res, next) {
    req.connection = connection;
    next();
});

/**
 * Routing
 */
app.get('/', function(req, res) {
   res.send('hello Andrew');
});
authAPI(app);
shoutsAPI(app);
userAPI(app);
voteAPI(app);

/**
 * Server
 */
app.listen(3000);
