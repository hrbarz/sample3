define([
  'jquery',
  'underscore',
  'backbone',
  'models/task'
], function($, _, Backbone, TaskModel){
    
    var Task = Backbone.Collection.extend({
        
            model: TaskModel,
        
            url: '/task',

            count_alltasks_priority: function(callback){

              that = this;

              $.ajax({

                  url: that.url + '/count_alltasks_priority' ,
                  
                  success: function(data){

                      callback(data);

                  }

              });
            },            

            get_count_priority: function(idtasklist,callback){

            	that = this;

	            $.ajax({

	                url: that.url + '/count_priority/'+ idtasklist ,
	                
                  success: function(data){

	                    callback(data);

	                }

	            });
	          },

            get_tasks_finished: function(idtasklist,callback){

               $.ajax({
                  url: that.url + '/tasklist/'+ idtasklist ,

                  data: {status:'finish'},
                  
                  success: function(data){

                      callback(data);

                  }

              });

            }
        });

    return Task;

});