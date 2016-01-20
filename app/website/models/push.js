var conf = require('../../../conf'),
     sql = require('mssql'),
  config = {};

var Push = function(config){
  //Inicializamos el objeto config
	this.config = config || {};
  //Inicializamos la conexión
  connectionString = {
    user: this.config.parameters.SQL_user,
    password: this.config.parameters.SQL_password,
    server: this.config.parameters.SQL_server, // You can use 'localhost\\instance' to connect to named instance 
    database: this.config.parameters.SQL_database,
    connectionTimeout: this.config.parameters.SQL_connectionTimeout,
    options: {
        encrypt: false // Use this if you're on Windows Azure 
    }
  };
};


//Funciones
Push.prototype.getNotificacion = function(params,callback){
    sql.connect(connectionString, function(err) {
      // Stored Procedure 
      var request = new sql.Request();
      request.input('idEmpleado', sql.Int, params);
      // request.output('output_parameter', sql.VarChar(50));
      request.execute('SEL_NOTIFICACION_SP', function(err, recordsets, returnValue) {
        // ... error checks 
        callback(err, recordsets[0]);
      });
    });
};

module.exports = Push; 