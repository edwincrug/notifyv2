﻿var notificacionUrl = global_settings.urlCORS + '/api/notificacionapi/';

registrationModule.factory('notificacionRepository', function ($http) {
    return {
        get: function (id) {
            return $http.get(notificacionUrl + '1|' + id);
        },
        update: function (id) {
            return $http.post(notificacionUrl + '2|' + id);
        },
        getPdf: function (tipo,folio,nodo) {
            return $http.get(notificacionUrl + '2|' + tipo +'|'+ folio+'|' + nodo);
        }
    };
});