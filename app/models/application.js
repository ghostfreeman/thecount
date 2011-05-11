var Model = require('./model');

var Application = module.exports = function () {
 
}
Application.prototype = Model;

Application.all = function( next ) {
  var query = 'SELECT * FROM apps';
  
  Model.client.query(query, next);
};

Application.create = function( name, next ) {
  var create_table_query = 'CREATE TABLE ' + 'app_' + name + '(name VARCHAR(100), counter INT DEFAULT 1, logged_at TIMESTAMP DEFAULT NOW(), duration INT DEFAULT 0)',
      insert_app_query = "INSERT INTO apps (name, api_key) VALUES('" + name + "', '" + generateAPIKey(name) + "')";
  
  // create the app specific table
  this.client.query(create_table_query, function(err, result) {
    if( err ) return next(err, result);
    
    // add the app to the apps table
    Model.client.query(insert_app_query, next);
  });
};

Application.findByName = function( name, next ) {
  var query = "SELECT * FROM apps where name='" + name + "'";
  
  Model.client.query(query, next);
}

Application.findByAPIKey = function( application, api_key, next ) {
  var query = "SELECT * FROM apps WHERE name = '" + application + "' AND api_key = '" + api_key + "'";
  
  Model.client.query(query, next);
}

// generate an API key for the app
function generateAPIKey ( name ) {
  var bits = [ name, ++Date, Math.random() ],
      hash = crypto.createHash('sha1');
  
  hash.update(bits.join('--'));
  
  return hash.digest('hex');
}



