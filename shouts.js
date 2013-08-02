modules.exports = function(app) {
   app.get('/shouts', function(req, res) {
      res.send(JSON.stringfy({'thisIsA': 'shout!', 'thisIsAnother':'shout2!'}));
   }

   app.post('/shouts', function(req,res) {

   }

   app.get('/shouts/:id') {

   }

   app.post('/comment/:id', function(req,res) {

   }
}
