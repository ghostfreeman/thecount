var sm = require('servermedium'),
    config = require('servermedium/config'),
    express = require('express'),
    app = express.createServer();
    
app
  .configure(all);

function all() {
  app
    .set('views', __dirname + '/views')
    .set('layouts', app.set('views') + '/layouts')
    .set('view engine', 'ejs')
    .set('view options', {
      layout: app.set('layouts') + '/application.html.ejs'
    })
    // .set('db', client)
    .set('config', config);

  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/../static', { maxAge: 1 }));
  app.use(express.logger( { format: "\033[1m[:date]\033[22m    :method :url - [:status]" } ));
  app.use(express.cookieParser());
  app.use(config.session);
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
}

var Application = require('app/models/application'),
    Stat = require('app/models/stat');
    
// Add Routes

var applications = require('./routes/applications').install(app),
    resources = require('./routes/stats').install(app);

app.listen(sm.listenPort, sm.listenHost);
