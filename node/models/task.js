module.exports = function(mongoose){ 

	var Schema = mongoose.Schema;

	var taskSchema = new Schema({
							tasklist: { type: Schema.Types.ObjectId, ref: 'Tasklist' },
						    name: String,  
						    description: String ,
							priority: { type: Number, min: 0, max: 3, default: 0 },
						    tags: [{ type: String , ref: 'Tag'}],
						    status: { type: String, default: 'pending' },
						    created_at: { type: Date, default: Date.now },
						    updated_at: { type: Date, default: Date.now }
						});

	try {
		
		return mongoose.model('Task'); 
	
	} catch (e) {
	
		return mongoose.model('Task', taskSchema); 
	}

}