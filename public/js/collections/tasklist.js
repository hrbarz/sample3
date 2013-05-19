define([
  'jquery',
  'underscore',
  'backbone',
  'models/tasklist'
], function($, _, Backbone, TasklistModel){
    
    var Tasklist = Backbone.Collection.extend({
        
        model: TasklistModel,
        
        url: '/tasklist'
        
    });

  return Tasklist;
});

/*
define([
        'io'
    ],

    function(io) {

    return {

        get_data: function(req,res){

           

        },

        get_list: function(req,res){

            


        },

        save_data: function(data,fn_action){

            console.log(data);

            fn_action();

        },

        delete : function(id){

            console.log('Elemento tasklist '+ id +' borrado')

        }

    }


});*/