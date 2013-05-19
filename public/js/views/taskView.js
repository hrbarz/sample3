define([
    'jquery',
    'underscore',
    'backbone',
    'collections/task',
    'models/task',
    'views/modal',
    'text!templates/task.html'
    ], function($,_,Backbone,TaskCollection,TaskModel,modal_form,taskTemplate) {

    		var taskCollection = new TaskCollection();  

        	var Task = Backbone.View.extend({

        		get_id		: function(e){
					return  $(e.target).attr('data-value');	            
	            },

	            el_tasklist	: function(idparent){
	            	return '#accordion' + idparent;
	            },

	            el_task 	: function(id){
	            	return '#item-task-' + id;
	            },

	            set_data_list_task: function(data, idtasklist){

	                _.each(data,function(task){

	                    $('#accordion_'+ task.tasklist + '_' + task.priority + ' .unchecked')
	                    .append( _.template(taskTemplate,{task: task, _:_}) );	                    

	                });

	                taskCollection.get_tasks_finished(idtasklist,function(data){

	                	
	                	_.map([0, 1, 2, 3], function(n){ 
	                	
	                		var val = _.where(data,{priority:n}).length;

	                		if(val > 0){

					        	$('#accordion_'+ idtasklist + '_' + n + ' .n-items')
					        	.html(val + ( val==1?' item ':' items') + ' completed');

					    	}
	                	
	                	});              	

	                	_.each(data,function(task){

	                    	$('#accordion_'+ task.tasklist + '_' + task.priority + ' .checked')
	                   		.append( _.template(taskTemplate,{task: task, _:_}) );

                   		});
                    
                    });
	                
	            },

	            reload_count_priority: function(id_tasklist){

	                taskCollection.get_count_priority(id_tasklist,function(data){
	
		               	for (var i = 0; i < 4; i++) {

	                        $('.count_priority_' + id_tasklist + ' .count_'+ i ).html(data.count[i]);

	                	};	

	                });

	            },

	            create: function(e){

	            	e.preventDefault();

					var idparent = this.get_id(e);					

                	modal_form.show({self:this,task:true});

					modal_form.title.html('Create Task');

					modal_form.set_data({
							action 	:'task',
							idparent:idparent,
							priority: 0
						});

					modal_form.realy();
				},

				insert_new: function(e){

					that = this;


					var idparent = this.get_id(e);
					
					var text = $(e.target).val();

					$(e.target).val('');

					if(text != ''){

						data = {};

						var task = new TaskModel();

						data.tasklist = idparent;

						data.priority = $(e.target).attr('data-priority');

						data.name = text;

						data.description = '';

						data.tags = get_hash_tags_text(data.name);

						task.save(data, {
					       
				        	success: function (task) {

				        		that.reload_count_priority(task.toJSON().tasklist);

								$('#accordion_' + data.tasklist + '_' + task.toJSON().priority + ' .unchecked')
									.prepend(_.template(taskTemplate, {task: task.toJSON(), _:_}));

								$("abbr.timeago").timeago();
	                            $(".accordion-inner p").url2Link(); 
				        	}

				        });

					}
				},

				save_data: function(){

					that = this;

					modal_form.show_alert();

					data = modal_form.get_data();
					
					if(_.isUndefined(data.id) || data.id == '' ){
                
	                    var task = new TaskModel();
	                
	                }else{
	                
	                    var task = new TaskModel({id: data.id});                
	                
	                }

					data.tasklist = data.idparent;

	                delete data.id;
					delete data.idparent;

					data.tags = get_hash_tags_text(data.name + ' ' + data.description);

					task.save(data, {
				       
				        success: function (task) {
                          
				            if(modal_form.id_form.val() == ''){
								
					        	that.reload_count_priority(task.toJSON().tasklist);

								modal_form.id_form.val(task.toJSON()._id);
								   
								$('#accordion_' + data.tasklist + '_' + task.toJSON().priority + ' .unchecked')
									.prepend(_.template(taskTemplate, {task: task.toJSON(), _:_}));
							
							}else{

								var blockpriority = $('#accordion_' + data.tasklist + '_' + task.toJSON().priority + ' '+ '#item-task-' + task.toJSON()._id);

								if(blockpriority.html() !== undefined){

									$('#item-task-' + task.toJSON()._id )
										.replaceWith(_.template(taskTemplate, {task: task.toJSON(), _:_}));

								}else{

									$('#item-task-' + task.toJSON()._id).remove();

									$('#accordion_' + data.tasklist + '_' + task.toJSON().priority+ ' .unchecked')
										.prepend(_.template(taskTemplate, {task: task.toJSON(), _:_}));


								}								

							}

                            modal_form.hide_alert();

                            $("abbr.timeago").timeago();
                            $(".accordion-inner p").url2Link();                       


				        }
				    });

				},

				edit: function(e){
	            
	                var id = this.get_id(e);

	                modal_form.show({self:this,task:true});

	                modal_form.title.html('Edit Task');

	                var task = new TaskModel({id: id});

	                    task.fetch({
	                   
	                        success: function (task,data) {

	                            modal_form.set_data({
	                                id          : data._id,
	                                name        : data.name,
	                                description : data.description,
	                                idparent	: data.tasklist,
	                                priority	: data.priority,
	                                action      : 'task'
	                            });
	                                                
	                            modal_form.realy();

	                        }
	                    })


	            }, 

        		check : function(e){

        			that = this;

        			var id = this.get_id(e);
        			var btn_check = $(e.target);


                	if(btn_check.attr('value') == undefined){ //Fix Event Click <button> OR <i>
                		
                		btn_check = btn_check.parent();
                		id = btn_check.attr('data-value');
                		
                	}

	                

		            var title_task = $('#title-task-'+ id );

	                if(title_task !== undefined){

	                    if( btn_check.attr('value') == 'finish' ){
	                        
	                        this._check(id,function(task){

	                        	that.reload_count_priority(task.tasklist);
	                        	
	                        	title_task.addClass('cross-out');
	                        	

	                        	btn_check.find('i').removeClass('icon-minus');
	                        	btn_check.find('i').addClass('icon-ok');

	                        	btn_check.attr('value','pending');

	                        });
	                    
	                    }else{
	                        
	                        this._undo_check(id,function(task){

	                        	that.reload_count_priority(task.tasklist);	                        	

	                        	title_task.removeClass('cross-out');

	                        	
	                        	btn_check.find('i').addClass('icon-minus');
	                        	btn_check.find('i').removeClass('icon-ok');

	                        	btn_check.attr('value','finish');	                        	

	                        });

	                    }
	                }
	            },

	            _check: function (id,trigger){

	            	var task = new TaskModel({id: id});                
	                
					task.save({status:'finish'}, {
				       
				        success: function (task) {
				            trigger(task.toJSON());
				        }

				    });         

	            },

	            _undo_check: function(id,trigger){

	            	var task = new TaskModel({id: id});                
	                
					task.save({status:'pending'}, {
				       
				        success: function () {
				            trigger(task.toJSON());
				        }

				    });  
	            },

	            deletes: function(e){

					var id = this.get_id(e);

					if(confirm('You really want to delete?')){

						var task = new TaskModel({id:id});
						
						task.destroy({
					        success: function () {
					            $('#item-task-' + id).remove();
					        }
					    });

						

					}

				}

        	});

        	return Task;

});