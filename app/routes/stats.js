var Application = require('../models/application'),
    Stat = require('../models/stat');

exports.install = function install(app) {
  
  app.get('/:app/stats/:name/total.json', findApp, function(req, res, next) {    
    var application = req.params.app,
        name = req.params.name;

    Stat.total(application, name, function(err, result) {
      if( err ) throw err;
      res.send(result.rows);
    });
  });
  
  app.get('/:app/stats/:name/today.json', findApp, function(req, res, next) {    
    var application = req.params.app,
        name = req.params.name;
        
    Stat.today(application, name, function(err, result) {
      if( err ) throw err;
      console.log(result)
      res.send(result.rows);
    });
  });
  
  app.get('/:app/stats/:name/monthly.json', findApp, function(req, res, next) {    
    var application = req.params.app,
        name = req.params.name;

    Stat.monthly(application, name, function(err, result) {
      if(err) throw err;
      res.send(result.rows);
    });
  });
  
  // create a log counter for a given name (key)
  app.post('/:app/stats', findAppByAPIKey, function(req, res, next) {
    var application = req.params.app,
        stats = req.body.stats;

    Stat.create(application, stats, function(err, result) {
      if(err) throw err;
      res.send(200);
    });
  });
  
  function findAppByAPIKey ( req, res, next ) {
    var application = req.params.app,
        api_key = req.body.api_key;

    Application.findByAPIKey(application, api_key, function(err, result) {
      if( err ) throw err;
      
      if( result.rows.length !== 0  )
        next();
      else
        res.send('App Not Found', 404);
    });
  }
  
  function findApp ( req, res, next ) {
    var application = req.params.app;
    
    Application.findByName(application, function(err, result) {
      if( err ) throw err;
      
      if( result.rows.length !== 0  )
        next();
      else
        res.send('App Not Found', 404);
    });
  }

  return exports;
};