registrationModule.controller("aprobacionController", function ($scope, $rootScope, localStorageService, alertFactory, aprobacionRepository) {


    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //////////////////////////////////////////////////////////////////
    // Aprobación y Rechazo
    /////////////////////////////////////////////////////////////////
    //Aprobar una notificación
    $scope.Aprobar = function (not) {
        if(not.estatus != 6)
        {
            if(confirm('¿Desea aprobar el folio: ' + not.identificador + '?')){
                if ($scope.observacion != null){
                    $('#btnApprove').button('loading');
                    aprobacionRepository.responder(not.idAprobacion, 1,$scope.observacion)
                        .success(putASuccessCallback)
                        .error(errorCallBack);
                }
                else {
                    alertFactory.info('Debe incluir un comentario.');
                }
            }
        }  
        
    };

    //Success de aprobación
    var putASuccessCallback = function (data, status, headers, config) {
        if(data == 0){
            alertFactory.info('Aprobada Correctamente.')
        }
        if(data == -1){
            alertFactory.error('La solicitud fue aprobada previamente por otro autorizador.');
        }
        $('#btnApprove').button('reset');
            $rootScope.actualizar = true;
            $rootScope.Reload();
    };

    //Rechazar una notificación 
    $scope.Rechazar = function (not) {
        if(not.estatus != 6)
        {
            if(confirm('¿Desea rechazar el folio: ' + not.identificador + '?')){
                if ($scope.observacion != null ) {
                    $('#btnReject').button('loading');
                    aprobacionRepository.responder(not.idAprobacion, 0, $scope.observacion)
                        .success(putRSuccessCallback)
                        .error(errorCallBack);
                }
                else {
                    alertFactory.info('Debe incluir un comentario.');
                }
            }
        }
    };

    //Success de rechazo
    var putRSuccessCallback = function (data, status, headers, config) {
        alertFactory.warning('Rechazada Correctamente.')
        $('#btnReject').button('reset');
        $rootScope.actualizar = true;
        $rootScope.Reload();
    };

    /* LQMA 13012015 se agrego la funcionalidad para el boton de revision */
    $scope.Revisar = function (not) {
        //alert(not.identificador);
        if(not.estatus != 6)
        {
            if(confirm('¿Desea enviar a revisión el folio: ' + not.identificador + '?')){
                if ($scope.observacion != null ) {
                    $('#btnCheck').button('loading');
                    $rootScope.currentNotificacion = not;
                    aprobacionRepository.responder(not.idAprobacion, 2, $scope.observacion)
                        .success(putRvSuccessCallback)
                        .error(errorCallBack);
                }
                else {
                    alertFactory.info('Debe incluir un comentario.');
                }
        }
    }
    };

    /*LQMA 13012015 add funcionalidad succes */
    //Success de revision
    var putRvSuccessCallback = function (data, status, headers, config) {
        alertFactory.info('Enviado a Revisión Correctamente.')
        $('#btnReject').button('reset');
        $rootScope.actualizar = true;
        /*LQMA add 14012015  se agrega la observacion como mensaje al chat.*/
        $rootScope.comentario = $scope.observacion;
        $rootScope.EnviarComentario();

        $rootScope.Reload();
    };

    //Aceptar una alerta
    $scope.Aceptar = function (not) {
        $('#btnAceptar').button('loading');
        aprobacionRepository.aceptar(not.idAprobacion)
            .success(aceptarSuccessCallback)
            .error(errorCallBack);
    };

    //Success de Aceptar
    var aceptarSuccessCallback = function (data, status, headers, config) {
        $('#btnAceptar').button('reset');
        $rootScope.actualizar = true;
        $rootScope.Reload();
    };
});