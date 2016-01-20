registrationModule.controller("notificacionController", function ($scope, $filter, $rootScope, localStorageService, alertFactory, notificacionRepository, aprobacionRepository, filtroRepository) {

    //Propiedades
    $scope.oneAtATime = true;
    $scope.isSearching = false;
    //Variables de control de orden
    $scope.alphaOrder = false;
    $scope.tooltipAlphabeth = 'Ordenar Descencente';
    $scope.dateOrder = true;
    $scope.tooltipDate = 'Ordenar Ascendente';
    $scope.currentOrder = 1;
    //Variable de control de filtros
    $scope.filtrado = false; 
    //Manejo de cascada en filtros
    $scope.nivelCascada = 1;

    //Gestiona la conexión con el socket
    $scope.socket = null;
    $scope.connected = false;


    //Grupo de funciones de inicio
    $scope.init = function () {
        $rootScope.actualizar = true;
        $scope.currentMarca = null;

        //Inicializamos la fecha 
        $scope.hora = new Date();

        //Inicializamos el filtro
        $scope.txtAlphaOrder = '+identificador';
        $scope.txtDateOrder = '-fecha';

        //Inicializamos el reloj
        setInterval(function () {
            $scope.ReloadTime();
        }, 1000);

        //Inicializamos la función de parpadeo de chat
        setInterval(function () {
           // $('.parpadear').toggle('highlight');
        }, 500);

        // setInterval(function () {
        //     $rootScope.Reload();
        // }, global_settings.liveReload);
        $rootScope.currentEmployee = getParameterByName('id');
        if($rootScope.currentEmployee == ''){
            var idEmpleado = prompt("Ingrese un número de empleado", 1);
            $rootScope.currentEmployee = idEmpleado;
        }
        //Obtengo el nombre del empleado
        filtroRepository.getEmpleado($rootScope.currentEmployee)
            .success(getEmpleadoSuccessCallback)
            .error(errorCallBack);

        //Recargamos la lista de aprobaciones
        $rootScope.Reload();

        //Descargo el filtro padre
        GetMarca();

        setInterval(function(){ 
            if (!$scope.connected && $rootScope.currentEmployee != '') {
                console.log('Intentando reconexión...');
                SocketConnect();
            }
        }, 10000);

    };

    ////////////////////////////////////////////////////////////////////
    // Funciones de socket
    ////////////////////////////////////////////////////////////////////

    //Conecta el socket
    var SocketConnect = function() {
        //Inicio sesión en el socket para recibir actualizaciones
        $scope.socket = io.connect(global_settings.urlSocket);
        if($scope.socket != null){
           SocketJoin(); 
       }
   };

    //Declara los mensajes principales del socket
    var SocketJoin = function() {
        //Envío mis datos de usuario  
        $scope.socket.emit('login', { user : $rootScope.empleado });

        $scope.socket.on('hello', function(data){
            console.log(data.mensaje);
            $scope.connected = true;
        });

        $scope.socket.on('pkgNotificacion', function(data){
            //Obtiene Notificaciones
            console.log(data.length + ' dato(s) recibido(s) at: ' + new Date().toString())
            getNSuccessCallback(data,null,null,null);
        });

        $scope.socket.on('disconnect', function (){
            console.log('Se ha desconectado.');
            $scope.connected = false;
        });
    };


    //Mensajes en caso de error
    var errorCallBack = function (data, status, headers, config) {
        alertFactory.error('Ocurrio un problema: ' + data);
        $('#btnReject').button('reset');
        $('#btnApprove').button('reset');
    };

    //Obtiene los datos del empleado
    var getEmpleadoSuccessCallback = function (data, status, headers, config) {
        $rootScope.empleado = data;
        SocketConnect();
    };

    //Success al obtener notificaciones
    var getNSuccessCallback = function (data, status, headers, config) {
        //Obtiene Notificaciones
        if ($scope.listaNotificacion_original != null){
            var inicial = $scope.listaNotificacion_original.length;
            if($rootScope.actualizar){
                $scope.listaNotificacion_original = data;
                AsignaListaNotificacion(); 
                if($scope.currentOrder == 1)
                    ApplyDateOrder(); 
                else
                    ApplyAlphaOrder(); 
                if (data.length > inicial){
                    alertFactory.info((data.length - inicial).toString() + ' nuevas notificaciones.');
                }
            }
        }
        else{
            $scope.listaNotificacion_original = data;
            AsignaListaNotificacion();
        }
    };

    var AsignaListaNotificacion = function() {

        if($scope.currentMarca != null && $scope.currentAgencia != null && $scope.currentDepartamento != null){
            $scope.listaNotificacion = $filter('filter')($scope.listaNotificacion_original, { idEmpresa: $scope.currentMarca.emp_idempresa, idSucursal: $scope.currentAgencia.suc_idsucursal, idDepartamento: $scope.currentDepartamento.dep_iddepartamento } , true);
        }
        else if($scope.currentMarca != null && $scope.currentAgencia != null){
            $scope.listaNotificacion = $filter('filter')($scope.listaNotificacion_original, { idEmpresa: $scope.currentMarca.emp_idempresa, idSucursal: $scope.currentAgencia.suc_idsucursal } , true);
        }
        else if($scope.currentMarca != null){
            $scope.listaNotificacion = $filter('filter')($scope.listaNotificacion_original, { idEmpresa: $scope.currentMarca.emp_idempresa } , true);
        }
        else{
            $scope.listaNotificacion = $scope.listaNotificacion_original;
        }
        
    };

    //Success al obtener aprobaciones
    var getASuccessCallback = function (data, status, headers, config) {
        //Obtiene Aprobaciones
        if ($scope.listaAprobacion_original != null){
            var inicial = $scope.listaAprobacion_original.length;
            if(data.length != inicial){
                $scope.listaAprobacion_original = data;
                AsignaListaAprobacion(); 
                if($scope.currentOrder == 1)
                    ApplyDateOrder(); 
                else
                    ApplyAlphaOrder(); 
            }
        }
        else{
            $scope.listaAprobacion_original = data;
            AsignaListaAprobacion();
        }
    };

    var AsignaListaAprobacion = function() {
        if($scope.currentMarca != null && $scope.currentAgencia != null && $scope.currentDepartamento != null){
            $scope.listaAprobacion = $filter('filter')($scope.listaAprobacion_original, { idEmpresa: $scope.currentMarca.emp_idempresa, idSucursal: $scope.currentAgencia.suc_idsucursal, idDepartamento: $scope.currentDepartamento.dep_iddepartamento } , true);
        }
        else if($scope.currentMarca != null && $scope.currentAgencia != null){
            $scope.listaAprobacion = $filter('filter')($scope.listaAprobacion_original, { idEmpresa: $scope.currentMarca.emp_idempresa, idSucursal: $scope.currentAgencia.suc_idsucursal } , true);
        }
        else if($scope.currentMarca != null){
            $scope.listaAprobacion = $filter('filter')($scope.listaAprobacion_original, { idEmpresa: $scope.currentMarca.emp_idempresa } , true);
        }
        else{
            $scope.listaAprobacion = $scope.listaAprobacion_original;
        }
        
    };

    //Consulto el servidor para buscar nuevas notificaciones
    $rootScope.Reload = function () {
        //Obtengo las notificaciones
        notificacionRepository.get($rootScope.currentEmployee)
        .success(getNSuccessCallback)
        .error(errorCallBack);

       // Obtengo las aprobaciones
       aprobacionRepository.get($rootScope.currentEmployee)
       .success(getASuccessCallback)
       .error(errorCallBack);
   }

    //////////////////////////////////////////////////////////////////
    // Implementación para ver documentos
    //////////////////////////////////////////////////////////////////

    $scope.VerDocumento = function(not) {
        var cadena = not.adjunto;
        var ar = cadena.split("|");

        ar.forEach(function(entry){
            //not.ruta_archivos + entry
            var myWindow = window.open(not.ruta_archivos + entry, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=1024, height=768");
        });   
    };

    $scope.VerBusiness = function(not) {
        var myWindow = window.open(not.link, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=1024, height=768");
        // myWindow.document.write("<p>Detalle de la orden de compra en Business PRO</p>");
    };

    //Rercargo el reloj
    $scope.ReloadTime = function () {
        $scope.hora = new Date();
        $scope.$apply();
    };

    //////////////////////////////////////////////////////////////////
    //Funcionalidad de visto
    /////////////////////////////////////////////////////////////////
    $scope.Visto = function (not) {
        //Bloquea la actualización automática de notificaciones
        $rootScope.actualizar = !not.open;
        if(not.estado == 0){
            aprobacionRepository.visto($rootScope.currentEmployee, not.idAprobacion)
            .error(errorCallBack);
            not.estado = 1;
        }
    };

    /////////////////////////////////////////////////////////////////
    //Configuracion de Busquedas 
    /////////////////////////////////////////////////////////////////

    $scope.ViewSearch = function() {
        $scope.isSearching = !$scope.isSearching;
        $("#slideIzq").animate({
            width: "toggle"
        });
        if($scope.isSearching == false){
            $('#slideIzq').blur();
            $('#slideIzq').val('');
            $scope.keySearch = '';
        }
    };

    $scope.TextSearch = function() {
        $scope.keySearch = $('#slideIzq').val();
    };

    /////////////////////////////////////////////////////////////////
    //Configuracion de Ordenamiento 
    /////////////////////////////////////////////////////////////////

    $scope.AlphaOrder = function() {
        $scope.currentOrder = 2;
        //Administra el estado del botón
        $scope.alphaOrder = !$scope.alphaOrder;
        if($scope.alphaOrder == true){
            $scope.tooltipAlphabeth = 'Ordenar Ascendente';
            $scope.txtAlphaOrder = '-identificador';
            ApplyAlphaOrder();
        }
        else{

            $scope.tooltipAlphabeth = 'Ordenar Descencente';
            $scope.txtAlphaOrder = '+identificador';
            ApplyAlphaOrder();
        }

    }

    var ApplyAlphaOrder = function() {
        $scope.listaNotificacion = $filter('orderBy')($scope.listaNotificacion, $scope.txtAlphaOrder);
        $scope.listaAprobacion = $filter('orderBy')($scope.listaAprobacion, $scope.txtAlphaOrder);
    };

    $scope.DateOrder = function() {
        $scope.currentOrder = 1;
        //Administra el estado del botón
        $scope.dateOrder = !$scope.dateOrder;
        if($scope.dateOrder == true){
            $scope.tooltipDate = 'Ordenar Ascendente';  
            $scope.txtDateOrder = '-fecha';
            ApplyDateOrder();
        }
        else{

            $scope.tooltipDate = 'Ordenar Descencente';
            $scope.txtDateOrder = '+fecha';
            ApplyDateOrder();
        }
    };

    var ApplyDateOrder = function() {
        $scope.listaNotificacion = $filter('orderBy')($scope.listaNotificacion, $scope.txtDateOrder);
        $scope.listaAprobacion = $filter('orderBy')($scope.listaAprobacion, $scope.txtDateOrder);
    };

    /////////////////////////////////////////////////////////////////
    //Configuracion de Filtros 
    /////////////////////////////////////////////////////////////////

    $scope.ViewFiltro = function() {
        $('#modalFiltro').modal('show');
        
    };

    $scope.AplicarFiltro = function() {
        $scope.filtrado = true;
        AsignaListaNotificacion();
        AsignaListaAprobacion();
        $('#modalFiltro').modal('hide');
    };

    $scope.QuitarFiltro = function() {
        $scope.filtrado = false;
        $scope.nivelCascada = 1;
        $scope.currentMarca = null;
        $scope.currentAgencia  = null;
        $scope.currentDepartamento = null;
        AsignaListaNotificacion();
        AsignaListaAprobacion();
        $('#modalFiltro').modal('hide');
    };

    //Success de la lista de marcas
    var getMarcaCallback = function (data, status, headers, config) {
        $scope.listaMarca = data;
    }

    //Success de la lista de agencias
    var getAgenciaCallback = function (data, status, headers, config) {
        $scope.listaAgencia = data;
    }

    //Success de la lista de departamentos
    var getDepartamentoCallback = function (data, status, headers, config) {
        $scope.listaDepartamento = data;
    }

    //Obtiene las marcas para filtrar
    var GetMarca = function() {
        //Obtiene la lista de marcas
        filtroRepository.getMarca($rootScope.currentEmployee)
        .success(getMarcaCallback)
        .error(errorCallBack);
    };

    //Obtiene las listas para filtrar
    $scope.GetAgencia = function() {
        //Obtiene la lista de agencias
        filtroRepository.getAgencia($rootScope.currentEmployee,$scope.currentMarca.emp_idempresa)
        .success(getAgenciaCallback)
        .error(errorCallBack);
    };

    $scope.GetDepartamento = function() {
        //Obtiene la lista de departamentos
        filtroRepository.getDepartamento($rootScope.currentEmployee,$scope.currentMarca.emp_idempresa,$scope.currentAgencia.suc_idsucursal)
        .success(getDepartamentoCallback)
        .error(errorCallBack);
    };

    //Establece el valor de una Marca 
    $scope.SetMarca = function(mar) {
        $scope.currentMarca = mar;
        $scope.GetAgencia();
        $scope.nivelCascada = 2;
        $scope.currentAgencia = null;
        $scope.currentDepartamento = null;
    };

    //Establece el valor de una Marca 
    $scope.SetAgencia = function(age) {
        $scope.currentAgencia = age;
        $scope.GetDepartamento();
        $scope.nivelCascada = 3;
        $scope.currentDepartamento = null;
    };

    //Establece el valor de un departamento
    $scope.SetDepartamento = function(dep) {
        $scope.currentDepartamento = dep;
    };



});