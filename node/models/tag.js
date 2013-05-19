module.exports = function(mongoose){ 

	var Schema = mongoose.Schema;

	var tagSchema  = new Schema({  
						    _id: { type: String, unique: true }
						   //,tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
						});

	try {
		
		return mongoose.model('Tag'); 
	
	} catch (e) {
	
		return mongoose.model('Tag', tagSchema); 
	}

}