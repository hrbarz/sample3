module.exports = function(){  

	var express 	= require('express'),

		server 		= express(),

		MongoStore 	= require('connect-mongo')(express);


	server.use(express.cookieParser());

	server.use(express.session({
		secret: 'key+secret+now',
		store: new MongoStore({
			db: 'sample2'
		}),
		maxAge: 1000*60*5
	}));

	server.use(express.bodyParser());

	server.use(express.static('../public'));



	/*server.get('/test/:algo',function(req, res){

		req.session.algo = req.params.algo;

		res.send('OK')

	}); 

	server.get('/algo',function(req, res){

		res.send(req.session.algo)

	});*/


	server.listen(3003,function(data) {
		console.log('%s listening', server.name);		
	});

	return server;
}