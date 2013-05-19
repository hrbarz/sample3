define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'events',
  'bootstrap',
  'timeago',
  'url2link',
  'scripts'
], function($, _, Backbone, Vm, Events ,Bootstrap,Timeago){
  
    var AppView = Backbone.View.extend({
    
    el: '#container',
    
    initialize: function () {
      
    },

    render: function () {

      $.ajaxSetup({ cache: false });

      Bootstrap.initialize();


      //$(this.$el).html('');

      Backbone.history.start();
      
		}

	});

  return AppView;

});
