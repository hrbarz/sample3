define([
    'jquery',
    'underscore',
    'backbone',
    'collections/task',
    'collections/tasklist',
    'models/task',
    'text!templates/task.html',
    'text!templates/task_tasklist.html',
    'text!templates/task_edit.html',

    'autosize'

    ], function($,_,Backbone,TaskCollection,TasklistCollection,TaskModel,taskTemplate,tasksTaskListTemplate,taskEditTemplate) {

        var taskCollection = new TaskCollection();
        var tasklistCollection = new TasklistCollection();

        var Task = Backbone.View.extend({

            el: '#container',
            el_block_edit: '.block-edit-task',
            el_count_priority: '#count_priority',

            events: {

            },

            initialize: function(){
               
               
            },

            render: function (idtask){

                var that = this;

                $(this.el).html(taskTemplate);

                var task = new TaskModel({id: idtask});

                task.fetch({
                       
                    success: function (task,data) {

                        $(that.el_block_edit).html(_.template(taskEditTemplate,{task:data}));

                        //that.reload_count_priority(idtasklist);

                    }
                });

                 $('textarea').autosize();
            
            },

            
            reload_count_priority: function(idtasklist){

                taskCollection.get_count_priority(idtasklist,function(data){

                  for (var i = 0; i < 4; i++) {

                      $('#tasklist_'+ idtasklist + ' .p'+ i ).html(data.count[i]);

                  };  

                });

            }

            

       });

       return Task;

});