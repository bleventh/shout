var express = require('express'),
    shoutsAPI = require('./controllers/shouts.js');
var app = express();

app.get('/', function(req, res) {
   res.send('hello Andrew');
});

shoutsAPI(app);

app.listen(3000);
