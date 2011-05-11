var Model = require('./model');

var Stat = module.exports = function() {
 
}
Stat.prototype = Model;


Stat.total = function( application, name, next ) {
  var query = "SELECT sum(counter) as total from app_" + application + " WHERE name = '" + name + "'";
  
  Model.client.query(query, next);
};

Stat.today = function( application, name, next ) {
  var start = new Date(),
      end = new Date();
              
  startDay(start);
  endDay(end);
      
  var query = "SELECT sum(counter) as total from app_" + application + " WHERE name = '" + name + "'" + " AND logged_at >= '" + start.toUTCString() + "' AND logged_at <= '" + end.toUTCString() + "'";

  Model.client.query(query, next);
};

Stat.monthly = function( application, name, next ) {
  var query = "SELECT date_trunc('month', logged_at) AS \"month\", sum(counter) AS total " +
              "FROM app_" + app_name + " WHERE name = '" + name + "' AND logged_at > now() - interval '1 year' GROUP BY \"month\" ORDER BY \"month\"";
              
  Model.client.query(query, next);
};

Stat.create = function( application, stats, next ) {
  var query = '';
  
  if( stats instanceof Array )
    stats.forEach(function(stat) {
      query = insertStatQuery( application, stat, query );
    });
  else
    query = insertStatQuery( application, stats, query );
  
  Model.client.query(query, next);
};


function insertStatQuery ( application, stat, query ) {
  var counter = stat.counter || 1,
      duration = stat.duration || 0;
  
  return query + ("INSERT INTO app_" + application + " (name, counter, duration) VALUES ('" +
                  stat.name + "', " +
                  counter + ", " +
                  duration  + ");");
}

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


