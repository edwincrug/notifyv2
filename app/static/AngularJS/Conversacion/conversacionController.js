registrationModule.controller("conversacionController", function ($scope, $rootScope, $location, $anchorScroll, localStorageService, alertFactory, conversacionRepository) {


    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    ///////////////////////////////////////////////////////////////////
    // Muestra la ventana de chat
    //////////////////////////////////////////////////////////////////
    $scope.ShowChat = function (not) {
        $rootScope.currentNotificacion = not;
        conversacionRepository.get(not.id)
            .success(getSuccessCallback)
            .error(errorCallBack);
    }

    //Callback Succes al obtener el chat
    var getSuccessCallback = function (data, status, headers, config) {
        $rootScope.listaConversacion = data;
        $('#modalChat').modal('show');
        if($rootScope.currentNotificacion.chatPendiente > 0){
            conversacionRepository.update($rootScope.currentEmployee, $rootScope.currentNotificacion.idAprobacion)
                .error(errorCallBack);
        }
        setTimeout(function() {
            $location.hash('bottom');
            $anchorScroll();
        },500);
    };

    $scope.EnviarComentario = function () {
        if ($scope.comentario.length > 0)
        {
            $('#btnEnviar').button('loading');
            conversacionRepository.add($rootScope.currentNotificacion.id, $rootScope.currentEmployee, $scope.comentario)
                .success(postSuccessCallback)
                .error(errorCallBack);
        }
    }
    
    var postSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Comentarios registrados.');
        $('#btnEnviar').button('reset');
        $('#modalChat').modal('hide');
        $scope.comentario = '';
        $rootScope.actualizar = true;
        $rootScope.Reload();
    };
});