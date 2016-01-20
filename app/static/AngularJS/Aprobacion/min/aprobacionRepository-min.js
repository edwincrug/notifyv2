var aprobacionUrl = global_settings.urlCORS + '/api/aprobacionapi/';

registrationModule.factory('aprobacionRepository', function ($http) {
    return {
        get: function (id) {
            return $http.get(aprobacionUrl + '1|' + id);
        },
        visto: function (id,usuario) {
            return $http.post(aprobacionUrl + '1|' + id + '|' + usuario);
        },
        responder: function (id,aprobacion,observacion) {
            return $http.post(aprobacionUrl + '2|' + id + '|' + aprobacion + '|' + observacion);
        },
        aceptar: function (id) {
            return $http.post(aprobacionUrl + '3|' + id);
        }
    };
});

