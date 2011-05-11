var crypto = require('crypto'),
    Application = require('../models/application');

exports.install = function install(app) {
  
  // list the current apps
  app.get(/^\/(apps)?$/, requireAuth, function(req, res, next) {
    Application.all(function(err, result) {
      if(err) throw err;
      
      res.render('applications/index.html.ejs', {
        apps: result.rows
      });
    });
  });
  
  // render the new template
  app.get('/apps/new', requireAuth, function(req, res, next) {
    res.render('applications/new.html.ejs', {
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
    Application.create(req.body.name, function(err, result) {
      req.flash('notice', 'app created successfully');
      res.send(200);
    });
  });
  
  // render the show template
  app.get('/apps/:app', requireAuth, function(req, res, next) {
    var name = req.params.app;
    
    Application.findByName(name, function(err, result) {
      if( err ) throw err;
      
      if( result.rows.length !== 0 )
        res.render('applications/show.html.ejs', {
          title: name + ' - The Count',
          app: result.rows[0]
        });
      else
        res.send('App Not Found', 404);
    });
  });
  
  // use native browser auth to authenticate
  // this only happens if we aren't in development mode
  function requireAuth( req, res, next ) {
    if( req.session.authed || app.settings.env === 'development' ) return next();
        
    if( req.headers.authorization && authenticate( req ) ) {
        req.session.authed = true;
        next();
    } else
      res.send('Unauthroized', { 'WWW-Authenticate': 'Basic' }, 401);
  }
  
  // authenticate using native browser auth
  // creditials are in config
  function authenticate ( req ) {
    var config = app.settings.config,
        auth_header = req.headers.authorization,
        credentials = new Buffer(/Basic\s+(.+)$/gi.exec(auth_header)[1], 'base64').toString().split(':'),
        username = credentials[0],
        password = credentials[1];
    
    return username === config.credentials.username && password === config.credentials.password;
  }

  return exports;
};