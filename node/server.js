/*Load Config*/
var config 		= require('./config');

	global.config = config;


var db = require('mongoose');
	
	db.connect(config.creds.mongoose_auth,{ server: { poolSize: 1 }});

	global.db = db;


var server = require('./start')();

	require('./routes')(server);  
