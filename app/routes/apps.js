var crypto = require('crypto');

exports.install = function install(app) {
  
  // list the current apps
  app.get('/', requireAuth, function(req, res, next) {
    var db = app.settings.db,
        query = 'SELECT * FROM apps';
    
    db.query(query, function(err, result) {
      if(err) throw err;
      
      res.render('apps/index.html.ejs', {
        apps: result.rows
      });
    });
  });
  
  // render the new template
  app.get('/apps/new', requireAuth, function(req, res, next) {
    res.render('apps/new.html.ejs', {
      title: 'Add Your App',
      action: '/apps',
      method: 'post'
    });
  });
  
  // create an app
  // first we create a table namespaced for the app (app_APP_NAME)
  // if we are successfull, we insert a row in the apps table
  // the "apps" table is strictly used for checking existence of an app
  app.post('/apps', requireAuth, function(req, res, next) {
    var db = app.settings.db,
        app_name  = req.body.name,
        create_table_query = 'CREATE TABLE ' + 'app_' + app_name + '(name VARCHAR(100), counter INT DEFAULT 1, logged_at TIMESTAMP DEFAULT NOW(), duration INT DEFAULT 0)',
        insert_app_query = "INSERT INTO apps (name, api_key) VALUES('" + app_name + "', '" + generateAPIKey(app_name) + "')";
    
    db.query(create_table_query, function(err, result) {
      if(err) throw err;
      
      db.query(insert_app_query, function(err, result) {
        if(err) throw err;
        res.send('App created successfully');
      });
    });
  });
  
  // render the new template
  app.get('/apps/:app', requireAuth, function(req, res, next) {
    var db = app.settings.db,
        app_name = req.params.app,
        query = "SELECT * FROM apps where name='" + app_name + "'";
    
    db.query(query, function(err, result) {
      if(err) throw err;
      
      if( result.rows.length !== 0 )
        res.render('apps/keys.html.ejs', {
          title: app_name + ' API Keys',
          app: result.rows[0]
        });
      else
        res.send('App Not Found', 404);
    });
  });
  
  function requireAuth( req, res, next ) {
    if( req.session.authed ) return next();
        
    if( req.headers.authorization && authenticate( req ) ) {
        req.session.authed = true;
        next();
    } else 
      res.send('Unauthroized', { 'WWW-Authenticate': 'Basic' }, 401);
      

  }
  
  function authenticate ( req ) {
    var auth_header = req.headers.authorization,
        credentials = new Buffer(/Basic\s+(.+)$/gi.exec(auth_header)[1], 'base64').toString().split(':'),
        username = credentials[0],
        password = credentials[1];
    
    return username === 'foo' && password === 'bar';
  }
  
  function generateAPIKey ( app_name ) {
    var bits = [ app_name, ++Date, Math.random() ],
        hash = crypto.createHash('sha1');
    
    hash.update(bits.join('--'));
    
    return hash.digest('hex');
  }

  return exports;
};