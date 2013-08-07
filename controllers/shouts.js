module.exports = function(app) {
   app.get('/shouts', function(req, res) {
      if (req.connection) {
         console.log("connection!");
      } 
      res.send(JSON.stringify({'thisIsA': 'shout!', 'thisIsAnother':'shout2!'}));
   });

   app.get('/shouts/:id', function(req, res) {
      res.send('hola');
   });

   app.post('/shouts', function(req,res) {
      res.send('hello post');
   });

   app.post('/comment/:id', function(req,res) {
      res.send('hold ma dick');
   });
}
