define([
    'jquery',
    'underscore',
    'backbone',
    'collections/task',
    'collections/tasklist',
    'text!templates/home.html',
    'text!templates/home_tasks.html'

    ], function($,_,Backbone,TaskCollection,TasklistCollection,homeTemplate,homeTasksTemplate) {

        var taskCollection = new TaskCollection();
        var tasklistCollection = new TasklistCollection();

        var Home = Backbone.View.extend({

            el: '#container',
            el_list_task: '#list-task-home',

            events: {

            },

            initialize: function(){
               
               
            },

            render: function (){

                var that = this;

                $(this.el).html(homeTemplate);

                taskCollection.count_alltasks_priority(function(data){

                  _.each(data.count,function(val,key){

                      $('#home_'+key).html(val);

                  });

                });

               
                tasklistCollection.fetch({
                  
                    success: function(tasklist,data) {
                        
                       _.each(data,function(val){
                         
                          $(that.el_list_task).append( _.template(homeTasksTemplate,{tasklist:val}) );

                          taskCollection.get_count_priority(val._id,function(data){

                              _.each(data.count,function(cant,i){

                                  $('#tasklist_'+ val._id +' .p'+i).html(cant);

                              });

                          }); 
                         
                       });

                    }

                });


                //list-task-home


                // $(this.el).append(_.template(tasklistTemplate,{tasklist: data, _:_}));

            }

            

       });

       return Home;

});