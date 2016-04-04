var Push = function(conf){
	conf = conf || {};
}

function logError(err, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Error: " + err);
    res.end("");
}  

Push.prototype.not = function(res, object){
	/*res.render('article_see', object);*/
	if (object.error) { logError(object.error, res); return; }
	
	if (object.result) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify(object.result));
		res.end("");
	}
	else {
	}
}

//LQMA 04042016 aprobaciones
Push.prototype.apr = function(res, object){
	/*res.render('article_see', object);*/
	if (object.error) { logError(object.error, res); return; }
	
	if (object.result) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify(object.result));
		res.end("");
	}
	else {
	}
}

Push.prototype.add = function(res, object){
	/*res.render('article_add', object);*/
}
Push.prototype.edit = function(res, object){
	/*res.render('article_edir', object);*/
}
Push.prototype.list = function(res, object){
	/*res.render('article_list', object);*/
}

module.exports = Push; 
