var sys = require('sys'),
    spawn = require('child_process').spawn,
    config = require('servermedium/config');
    
var pg = require('pg').native,
    connection_string = 'postgres://' + config.db.user + ':' + config.db.password + '@localhost/' + config.db.name,
    client = new pg.Client(connection_string);
    
client.connect();

desc('run all tests or given test(s)');
task('test', [], function() {
  var to_test = Array.prototype.slice.call(arguments);
  
  if( to_test.length > 0 )
    sh('expresso', [ '-s' ].concat(to_test) );
  else
    sh('expresso', [ '-s', 'test/*.test.js' ]);
});

function sh ( command, arguments, cbk ) {
  var proc = spawn(command, arguments);
  proc.stdout.on('data', sys.print);
  proc.stderr.on('data', sys.print);
}