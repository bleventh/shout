var express = require('express'),
    shoutsAPI = require('./controllers/shouts.js'),
    authAPI = require('./controllers/auth.js'),
    userAPI = require('./controllers/user.js'),
    voteAPI = require('./controllers/amp.js');
var app = express();

/**
 * MiddleWare
 */

//put middleware in here if needed

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
