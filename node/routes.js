module.exports = function(server){  

    var task =  require('./routes/task');

    var tasklist =  require('./routes/tasklist');

	//Definiendo rutas para "tasklist"

    server.post(
        '/tasklist',    tasklist.create);

    server.get(
        '/tasklist/:id',tasklist.read);    

    server.put(
        '/tasklist/:id',tasklist.update);
    	
    server.del(
    	'/tasklist/:id',tasklist.delete);



    server.get(
        '/tasklist',    tasklist.list);

    server.get(
        '/tasklist/tasks/:id',tasklist.task_by_id);



    
    server.get(
        '/task/count_alltasks_priority', task.count_alltasks_priority); 


    server.post(
        '/task',        task.create);

    server.get(
        '/task/:id',    task.read);

    server.put(
        '/task/:id',    task.update);

    server.del(
    	'/task/:id',    task.delete);


    server.get(
        '/task/tasklist/:id',       task.by_tasklist);


    server.get(
        '/task/:id/count/:priority',task.count_priority); 

    server.get(
        '/task/count_priority/:id', task.count_priority_all); 




    server.get(
        '/task/tag/:name',          task.by_tag);




	//test upload #test
	server.put('/upload', respond);
	server.post('/upload', respond);

	function respond(req,res,next) {
		console.log(req.files);
		res.send('hello ');
	}

}