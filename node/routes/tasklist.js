var Tasklist 	= require( '../models/tasklist' )(db);
var Task  		= require( '../models/task')(db);


exports.create = function(req,res){

	//res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin); 
	//res.header("Access-Control-Allow-Headers", "X-Requested-With");

	if(req.body !== undefined){
		req.params = req.body;
	}
			
	var tasklist = new Tasklist({
		name: req.params.name, 
		description: req.params.description,
	});
	
	tasklist.save(function (err) {

		if (err) { return next(err); }

		res.send(tasklist.toJSON());

	});

}

exports.read = function(req,res){

	//	res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin); 
	//	res.header("Access-Control-Allow-Headers", "X-Requested-With");

    if(req.params.id !== undefined ){

        Tasklist.findById(req.params.id, function (err, tasklist) {
            //if (err) return next(err);

            res.send(tasklist.toJSON());

        });
    }
}

exports.update = function(req,res){

	//res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin); 
	//res.header("Access-Control-Allow-Headers", "X-Requested-With");

	if(req.body !== undefined){
		req.params = req.body;
	}
	
	if(req.params.id !== undefined ){

		Tasklist
			.findOne({ _id: req.params.id })
        	.select('_id name description tasks')
			.populate({
	            path    : 'tasks',
                select  : '_id tasklist name description status priority created_at updated_at',
	            options : { sort: [['created_at', -1 ]] }
	         })
			.exec(function(err, tasklist){
				
				if (err) { return next(err); }

				tasklist.name = req.params.name;
				tasklist.description = req.params.description;
				
				tasklist.updated_at = Date();

				tasklist.save(function (err) {
				
					if (err) { return next(err); }

					res.send(tasklist.toJSON());
				
				});
			});
	}		
}

exports.delete = function(req,res){

	//res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin); 
	//res.header("Access-Control-Allow-Headers", "X-Requested-With");

	if(req.params.id !== undefined ){		

		Task.remove({tasklist: req.params.id}, function(err, numberRemoved) {		
			//if(numberRemoved === 0) next(new Error("ID was not found."));
			if (err) { return next(err); }
			
			Tasklist.remove({_id: req.params.id}, function(err, numberRemoved){
				if (err) { return next(err); }
				
				res.end();

			});

		});

	}
}

exports.list = function(req,res){

    //res.header("Access-Control-Allow-Origin", '*'); 
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");

    Tasklist
        .find()
        .sort('-created_at')
        .select('_id name description tasks')
        .populate({
            path    : 'tasks',
            select  : '_id tasklist name description status priority created_at updated_at',
            match	: { status: 'pending'},
            options : { sort: [['created_at', -1 ]] }
          })
        .exec(function (err, result) {
            
          if (err) return handleError(err);

            res.send(result);
        
        });
    	
}

exports.task_by_id = function(req,res){
	
	if(req.params.id !== undefined ){	

	    Tasklist
	        .findOne({ _id: req.params.id})
	        .sort('-created_at')
	        .select('_id name description tasks')
	        .populate({
	            path    : 'tasks',
	            select  : '_id tasklist name description status priority created_at updated_at',
	            match	: { status: 'pending'},
	            options : { sort: [['created_at', -1 ]] }
	          })
	        .exec(function (err, result) {
	            
	          if (err) return handleError(err);

	            res.send(result);
	        
	        });
	}
    	
}

