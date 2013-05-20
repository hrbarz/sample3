define([
    'jquery',
    'underscore',
    'backbone',
    'collections/task',
    'collections/tasklist',
    'text!templates/tasklist.html',
    'text!templates/home_tasks.html',
    'text!templates/tasklist_item_task.html'

    ], function($,_,Backbone,TaskCollection,TasklistCollection,tasklistTemplate,homeTasksTemplate,tasklistItemTemplate) {

        var taskCollection = new TaskCollection();
        var tasklistCollection = new TasklistCollection();

        var Home = Backbone.View.extend({

            el: '#container',
            el_list_task: '#list-task-home',

            events: {

            },

            initialize: function(){
               
               
            },

            render: function (idtasklist){

                var that = this;

                $(this.el).html(tasklistTemplate);

                tasklistCollection.get_tasks_finished(idtasklist,function(data){

                    $(that.el_list_task).html( _.template(homeTasksTemplate,{tasklist:data}) );

                    that.reload_count_priority(idtasklist);

                    that.set_data_list_task(data.tasks, data._id);    

                });                
            },

            set_data_list_task: function(data, idtasklist){

                console.log(data)

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

                    console.log(data);

                    _.each(data,function(task){

                      //$('#accordion_'+ task.tasklist + '_' + task.priority + ' .checked')
                      
                      $('.pb' + task.priority + ' .list-task-checked').append( _.template(tasklistItemTemplate,{task: task, _:_}) );

                    });
                
                });
                
            },

            reload_count_priority: function(idtasklist){

                taskCollection.get_count_priority(idtasklist,function(data){

                  for (var i = 0; i < 4; i++) {

                      $('#tasklist_'+ idtasklist + ' .p'+ i ).html(data.count[i]);

                  };  

                });

            }

            

       });

       return Home;

});