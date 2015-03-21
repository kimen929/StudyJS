var settings = require('../settings'),
		Db = require('mongodb').Db,
		Connection = require('mongodb').Connection,
		Server = require('mongodb').Server;
module.exports = newaDb(settings.db, new Server(settings.host, settings.port), {safe:true});
