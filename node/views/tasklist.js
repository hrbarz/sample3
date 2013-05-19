/*Connect DataBase*/
//var config    = require('../config');

var Tasklist  = require('../models/tasklist');

var db = {

    connect:  function(){

        this.mongoose = require('mongoose').connect(config.creds.mongoose_auth);

        return ;  

    },

    close: function(){

        this.mongoose.connection.close();

    }
}

module.exports = {

    list: function(req, res){
        
        res.header("Access-Control-Allow-Origin", "http://sample2.dev"); 
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        //db.connect();
        
        Tasklist.find(function(err, result) {  

           // db.close();

            res.send(result);     
        });  

    },
    
    save: function(req, res){

        res.header("Access-Control-Allow-Origin", "http://sample2.dev"); 
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

       
        var tasklist = new Tasklist({
                            name: req.params.name, 
                            description: req.params.description
                        }); 

            tasklist.save();
        
        res.end();
    },  

    find: function(req, res) {  
        
        res.header("Access-Control-Allow-Origin", "http://sample2.dev"); 
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        Tasklist.findOne({_id: req.params.id}, function(error, result) {  
            res.send(result);  
        });

    }
}  