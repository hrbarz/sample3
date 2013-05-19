var Task  		= require( '../models/task')(db);
var Tasklist	= require( '../models/tasklist')(db);
var Tag  		= require( '../models/tag')(db);

var saveTags = function(tags){

	var Tags = [];

	for (var i = 0; i < tags.length; i++) {
		
		Tags[i] = new Tag({_id:tags[i]});
		Tags[i].save();

	};
}


exports.create = function(req,res){

	if(req.body !== undefined){
		req.params = req.body;
	}


	if(req.params.tasklist !== undefined ){

		Tasklist.findById(req.params.tasklist, function(err, tasklist){
			
			if (err) { return next(err); }

			if (tasklist == null){ return res.send({error:true,description:'tasklist no exist'});}			

			if (req.params.tags !== undefined || req.params.tags !== null ){

				saveTags(req.params.tags);
				
			}



			dataTask = {
				name: req.params.name, 
				description: req.params.description,
				tasklist: req.params.tasklist,
				tags: req.params.tags,
				priority: req.params.priority,
			}

			var task = new Task(dataTask);
						
			task.save(function (err) {

				tasklist.tasks.push(task._id);
				
				tasklist.save(function(err) {
					
					if (err) { return next(err); }

					res.send(task.toJSON());

				});

			});
		});
	
	}else{
		res.send(500, 'Parametros incompletos');
	}	

}


exports.read = function(req,res){

	//res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin); 
	//res.header("Access-Control-Allow-Headers", "X-Requested-With");

    if(req.params.id !== undefined ){

        Task.findById(req.params.id, function (err, task) {
            //if (err) return next(err);

            res.send(task);

        });
    }
}


exports.update = function(req,res){

	res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin); 
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	if(req.body !== undefined){
		req.params = req.body;
	}   	
	
	if(req.params.id !== undefined ){
		
		if(req.params.tags !== undefined && req.params.tags !== null ){

			var Tags = [];

			for (var i = 0; i < req.params.tags.length; i++) {
				
				Tags[i] = new Tag({_id:req.params.tags[i]});
				Tags[i].save();

			};
		}
	
		Task.findById(req.params.id, function(err, task){

			if (err) { return next(err); }

			if(req.params.name !== null && req.params.name !== undefined)
				task.name = req.params.name;
			
			if(req.params.description !== null && req.params.description !== undefined)
				task.description = req.params.description;

			if(req.params.status !== null && req.params.status !== undefined)
				task.status = req.params.status;

			if(req.params.tags !== undefined)
				task.tags = req.params.tags;

			if(req.params.priority !== undefined)
				task.priority = req.params.priority;


			task.updated_at = Date();

			task.save(function (err) {
				
				if (err) { return next(err); }				

				res.send(task.toJSON());
			
			});
		});
	}		
}

exports.delete = function(req,res){

	//res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin); 
	//res.header("Access-Control-Allow-Headers", "X-Requested-With");
	
	if(req.params.id !== undefined ){
		
		Task.findById(req.params.id, function(err,task){

			if (err) { return next(err); }

			if (task == undefined ) { return res.end() }


			Tasklist.findById(task.tasklist, function(err, tasklist){

				tasklist.tasks.remove(req.params.id);

				tasklist.save(function(err) {
				
					if (err) { return next(err); }

					task.remove(function(err) {

						res.end();

					});
					
				});
				
			});
		
		});
			
	}		
}

exports.count_priority = function(req,res){

    Task.count(
    	 { 
    		 tasklist:req.params.id
    		,priority:req.params.priority
    		,status:'pending'
    	 }
    	, function (err, count) {
        	
        	if (err) return handleError(err);
     
        	res.send({name: req.params.priority,count:count});    
	    }
	);
}

exports.count_alltasks_priority = function(req,res){

    //res.header("Access-Control-Allow-Origin", '*'); 
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var get_count = function(priority,values,end){
  
	    Task.count(
	         { 
	            priority:priority
	            ,status:'pending'
	         }
	        , function (err, count) {

	        	values.push(count);

	        	priority++;

	        	if(priority == 4){
			    	return end(values);
			    }

	            get_count(priority,values,end);

	    	}
	    );
	}

	get_count( 0 , [] ,function (values){

		res.send({count:values});
	
	});
	
}

exports.count_priority_all = function(req,res){

    //res.header("Access-Control-Allow-Origin", '*'); 
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var get_count = function(tasklist,priority,values,end){
  
	    Task.count(
	         { 
	             tasklist:tasklist
	            ,priority:priority
	            ,status:'pending'
	         }
	        , function (err, count) {

	        	values.push(count);

	        	priority++;

	        	if(priority == 4){
			    	return end(values);
			    }

	            get_count(tasklist,priority,values,end);

	    	}
	    );
	}

	get_count(req.params.id , 0 , [] ,function (values){

		res.send({id: req.params.id ,count:values});
	
	});
	
}

exports.by_tasklist = function(req,res){

	//res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin); 
	//res.header("Access-Control-Allow-Headers", "X-Requested-With");

	var match = {};
		match.tasklist = req.params.id;

	if(req.query["status"] !== undefined){

		var status = req.query["status"];

		if(status == 'pending'){
			
			match.status = 'pending';

		}else if(status == 'finish'){
			
			match.status = 'finish';
		
		}

	}


    if(req.params.id !== undefined ){

        Task.find(match, function (err, task) {
            //if (err) return next(err);
            res.send(task);

        });
    }
}

exports.by_tag = function(req,res){

	//res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin); 
	//res.header("Access-Control-Allow-Headers", "X-Requested-With");

    Task
      .find({ tags: { $in : [req.params.name] } })
      .exec(function (err, result) {
          
          res.send(result);
      
      });

		
}

