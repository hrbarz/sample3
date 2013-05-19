require.config({
  paths: {
    jquery      : 'libs/jquery/jquery-min',
    underscore  : 'libs/underscore/underscore-min',
    backbone    : 'libs/backbone/backbone-min',
    io          : 'libs/socket-io/socket-io-min',
    
    templates   : '../templates',
  
    // Require.js plugins
    text        : 'libs/require/text',
    //order       : 'libs/require/order'

    //vendors
    timeago     : 'vendor/jquery.timeago',
    url2link    : 'vendor/jquery.url2link'

  },

  urlArgs : "bust="+new Date().getTime()
  
});

require([
  'views/app',
  'router',
  'vm'
], function(AppView, Router, Vm){
  
  var appView = Vm.create({}, 'AppView', AppView);
  
  Router.initialize({appView: appView});
  
  appView.render(); // render() calls Backbone.history when its ready to start

});
