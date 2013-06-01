// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
	'vm'
], function ($, _, Backbone, Vm) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      ''              : 'viewPageHome',
      'home'          : 'viewPageHome',
      'tasklist/:id'  : 'viewPageTasklist',
      'task/:id'      : 'viewPageTask'
    }
  });

  var initialize = function(options){
		
    var appView = options.appView;
    
    var router = new AppRouter(options);

		router.on('route:viewPageHome', function () {

      require(['views/homeView'], function (ViewPage) {
      
        var viewPage = Vm.create(appView, 'ViewPage', ViewPage);
      
        viewPage.render();
      
      });
		
    });

    router.on('route:viewPageTasklist', function (id) {
      
      require(['views/tasklistView'], function (ViewPage) {
      
        var viewPage = Vm.create(appView, 'ViewPage', ViewPage);
      
        viewPage.render(id);
      
      });
    
    });


    router.on('route:viewPageTask', function (id) {
      
      require(['views/taskView'], function (ViewPage) {
      
        var viewPage = Vm.create(appView, 'ViewPage', ViewPage);
      
        viewPage.render(id);

      
      });
    
    });    


    
  };
  return {
    initialize: initialize
  };
});
