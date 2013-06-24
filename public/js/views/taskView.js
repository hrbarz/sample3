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

            el                  : '#container',
            el_block_edit       : '.block-edit-task',
            el_count_priority   : '#count_priority',

            events: {

                'click #btn_save'           : 'save',
                'click #btn_change_status'  : 'change_status'

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
                        $('textarea').autosize();

                        $(that.el_block_edit).fadeIn(200);

                    }
                });               
            
            },

            
            reload_count_priority: function(idtasklist){

                taskCollection.get_count_priority(idtasklist,function(data){

                  for (var i = 0; i < 4; i++) {

                      $('#tasklist_'+ idtasklist + ' .p'+ i ).html(data.count[i]);

                  };  

                });

            },


            save: function(e){

                var 
                id = $(e.target).data('id') ,
                data = {},
                task = new TaskModel({id: id});
                

                data.name = $('.title textarea').val();
                data.description = $('.description textarea').val();
                data.tags = window.get_hash_tags_text(data.name + ' ' + data.description);

                task.save(data, {
                       
                    success: function (task) {

                    }
                });
 
            },

            change_status: function(e){

                var 
                id = $(e.target).data('id') ,
                val = $(e.target).data('value') ,
                task = new TaskModel({id: id});

                var tigger = function (status){

                    $(e.target).data('value',status);

                    if(status == 'finish'){


                        $('#btn_change_status').removeClass('pending');
                        $('#btn_change_status').addClass('finish');

                        $('#btn_change_status i').removeClass('icon-minus');
                        $('#btn_change_status i').addClass('icon-ok');


                        $('#btn_change_status').html($('#btn_change_status').html().replace('Pending','Finish'));

                    }else{
                        
                        $('#btn_change_status').removeClass('finish');
                        $('#btn_change_status').addClass('pending');

                        $('#btn_change_status i').removeClass('icon-ok');
                        $('#btn_change_status i').addClass('icon-minus');

                        $('#btn_change_status').html($('#btn_change_status').html().replace('Finish','Pending'));

                    }
                    


                }


                if(val == 'finish')
                    val = 'pending';
                else
                    val = 'finish';               
                    
                task.save({status:val}, {
                   
                    success: function (task) {

                        tigger(val);
                        
                    }

                });      
            }

            

       });

       return Task;

});