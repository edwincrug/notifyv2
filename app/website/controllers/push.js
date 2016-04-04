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

Push.prototype.get_not_data = function(req,res,next){
	var object = {};
	var params = {}; 
	var self = this;

	var parameters = JSON.parse(req.params.data);

	this.model.getNotificacion(parameters,function(error,result){
		
		object.error = error;
		object.result = result;
		
		self.view.not(res, object);
	});
}

Push.prototype.get_apr_data = function(req,res,next){
	var object = {};
	var params = {}; 
	var self = this;

	var parameters = JSON.parse(req.params.data);

	this.model.getAprobacion(parameters,function(error,result){
		
		object.error = error;
		object.result = result;
		
		self.view.apr(res, object);
	});
}

module.exports = Push;