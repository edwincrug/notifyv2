var PushView = require('../views/push'),
	PushModel = require('../models/push');

var Push = function(config){
	this.config = config || {};

	this.view = new PushView();
	this.model = new PushModel({ parameters : this.config.parameters});

	this.response = function(){
		this[this.config.funcionalidad](this.config.req,this.config.res,this.config.next);
	}
}

Push.prototype.get_see_data = function(req,res,next){
	var object = {};
	var params = {}; 
	var self = this;

	var parameters = JSON.parse(req.params.data);

	this.model.getNotificacion(parameters,function(error,result){
		
		object.error = error;
		object.result = result;
		
		self.view.see(res, object);
	});
}

module.exports = Push;