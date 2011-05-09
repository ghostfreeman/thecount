exports.install = function install(app) {
  
  // return all of the log entries for an app
  app.get('/:app/stats', findApp, function(req, res, next) {
    var app_name = req.params.app,
        query = "SELECT * from app_" + app_name;
    
    app.settings.db.query(query, function(err, result) {
      if(err) throw err;
      
      res.send(result.rows);
    });
  });
  
  app.get('/:app/stats/:name/total.json', findApp, function(req, res, next) {    
    var app_name = req.params.app,
        name = req.params.name;
        
    var query = "SELECT sum(counter) as total from app_" + app_name + " WHERE name = '" + name + "'";

    app.settings.db.query(query, function(err, result) {
      if(err) throw err;
      
      res.send(result.rows);
    });
  });
  
  app.get('/:app/stats/:name/today.json', findApp, function(req, res, next) {    
    var app_name = req.params.app,
        name = req.params.name,
        start = new Date(),
        end = new Date();
                
    startDay(start);
    endDay(end);
        
    var query = "SELECT sum(counter) as total from app_" + app_name + " WHERE name = '" + name + "'" + " AND logged_at >= '" + start.toUTCString() + "' AND logged_at <= '" + end.toUTCString() + "'";

    app.settings.db.query(query, function(err, result) {
      if(err) throw err;
      
      res.send(result.rows);
    });
  });
  
  app.get('/:app/stats/:name/monthly.json', findApp, function(req, res, next) {    
    var app_name = req.params.app,
        name = req.params.name;
        
    var query = "SELECT date_trunc('month', logged_at) AS \"month\", sum(counter) AS total " +
                "FROM app_" + app_name + " WHERE name = '" + name + "' AND logged_at > now() - interval '1 year' GROUP BY \"month\" ORDER BY \"month\"";

    app.settings.db.query(query, function(err, result) {
      if(err) throw err;

      res.send(result.rows);
    });
  });
  
  
  
  // create a log counter for a given name (key)
  app.post('/:app/stats', findAppByAPIKey, function(req, res, next) {
    var app_name = req.params.app,
        name = req.body.name,
        counter = req.body.counter || 1,
        duration = req.body.duration || 0,
        query = "INSERT INTO app_" + app_name + " (name, counter, duration) VALUES ('" +
                name + "', " +
                counter + ", " +
                duration  + ")";
    
    app.settings.db.query(query, function(err, result) {
      if(err) throw err;
      
      res.send(result);
    });
  });
  
  function startDay ( date ) {
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
  }
  
  function endDay ( date ) {
    date.setUTCHours(24);
    date.setUTCMinutes(59);
    date.setUTCSeconds(59);
  }
  
  function findAppByAPIKey ( req, res, next ) {
    var app_name = req.params.app,
        api_key = req.body.api_key,
        query = "SELECT * FROM apps WHERE name = '" + app_name + "' AND api_key = '" + api_key + "'";

    app.settings.db.query(query, function(err, result) {
      if( err ) throw err;
      
      if( result.rows.length !== 0  )
        next();
      else
        res.send('App Not Found', 404);
    });
  }
  
  function findApp ( req, res, next ) {
    var app_name = req.params.app,
        query = "SELECT * FROM apps WHERE name = '" + app_name + "'";

    app.settings.db.query(query, function(err, result) {
      if( err ) throw err;
      
      if( result.rows.length !== 0  )
        next();
      else
        res.send('App Not Found', 404);
    });
  }

  return exports;
};