var config = require('servermedium/config');

function Model () {
  var self = this;
  
  function connect () {
    var pg = require('pg').native,
        connection_string = 'postgres://' + config.db.user + ':' + config.db.password + '@localhost/' + config.db.name,
        client = new pg.Client(connection_string);
        
    client.connect();
    self.client = client;
  }
  
  connect();
}

module.exports = new Model();
