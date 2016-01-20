var filtroUrl = global_settings.urlCORS + '/api/filtroapi/';

registrationModule.factory('filtroRepository', function ($http) {
    return {
        getEmpleado: function (id) {
            return $http.get(filtroUrl + '1|' + id);
        },
        getMarca: function (empleado) {
            return $http.get(filtroUrl + '2|' + empleado);
        },
        getAgencia: function (empleado,empresa) {
            return $http.get(filtroUrl + '3|' + empleado + '|' + empresa);
        },
        getDepartamento: function (empleado,empresa,agencia) {
            return $http.get(filtroUrl + '4|' + empleado + '|' + empresa + '|' + agencia);
        },
        add: function (notificacion,empleado,comentario) {
            return $http.post(filtroUrl + '1|');
        },
        delete: function (obj) {
            return $http.delete(filtroUrl + obj.id);
        },
        update: function (id) {
            return $http.put(filtroUrl + '1|' + id);
        }
    };
});