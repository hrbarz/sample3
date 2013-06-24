define([
    'jquery',
    'underscore',
    'backbone',
    'collections/task',
    'collections/tasklist',
    'models/task',
    'text!templates/tasklist.html',
    'text!templates/home_tasks.html',
    'text!templates/tasklist_item_task.html'

    ], function($,_,Backbone,TaskCollection,TasklistCollection,TaskModel,tasklistTemplate,homeTasksTemplate,tasklistItemTemplate) {

        var taskCollection = new TaskCollection();
        var tasklistCollection = new TasklistCollection();

        var Tasklist = Backbone.View.extend({

            id: 0 ,

            el: '#container',
            el_list_task: '#list-task-home',

            events: {

                "keypress .insert_task" : "insert_task"

            },

            initialize: function(){
               
               
            },

            render: function (idtasklist){

                this.id = idtasklist;

                var that = this;

                $(this.el).html(tasklistTemplate);

                tasklistCollection.get_tasks_finished(idtasklist,function(data){

                    $(that.el_list_task).html( _.template(homeTasksTemplate,{tasklist:data}) );

                    that.reload_count_priority(idtasklist);

                    that.set_data_list_task(data.tasks, data._id);    

                });                
            },

            set_data_list_task: function(data, idtasklist){

                _.each(data,function(task){

                    $('.pb' + task.priority + ' .list-task-unchecked').append( _.template(tasklistItemTemplate,{task: task}) );                                       

                });

                taskCollection.get_tasks_finished(idtasklist,function(data){
                
                    _.map([0, 1, 2, 3], function(n){ 
                  
                        var val = _.where(data,{priority:n}).length;

                        if(val > 0){

                          $('.pb' + n+ ' .btn-task-checked').html(val + ( val==1?' item ':' items') + ' completed');

                        }else{
                          $('.pb' + n+ ' .btn-task-checked').html('');
                        }
                
                    });

                    _.each(data,function(task){
                      
                      $('.pb' + task.priority + ' .list-task-checked').append( _.template(tasklistItemTemplate,{task: task, _:_}) );

                    });              
                });

                $('.block-priority').fadeIn(200);

                
            },

            reload_count_priority: function(idtasklist){

                taskCollection.get_count_priority(idtasklist,function(data){

                  for (var i = 0; i < 4; i++) {

                      $('#tasklist_'+ idtasklist + ' .p'+ i ).html(data.count[i]);

                  };  

                });

            },

            insert_task: function(e){

                var that = this;

                if (e.keyCode != 13) 
                    return; 

                var
                text = $(e.target).val() ,
                priority = $(e.target).data('priority'),
                data = {},
                task;

                data.name = text;

                data.tasklist = this.id;

                data.priority = priority;

                data.description = '';

                data.tags = window.get_hash_tags_text(data.name);

                
                task = new TaskModel(); 

                task.save(data, {
                   
                    success: function (task) {

                        that.reload_count_priority(that.id);

                        $('.pb' + priority + ' .list-task-unchecked').prepend( _.template(tasklistItemTemplate,{task: task.toJSON()}) );
                        
                    }

                });

            }

            

       });

       return Tasklist;

});