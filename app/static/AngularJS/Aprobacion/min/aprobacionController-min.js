registrationModule.controller("aprobacionController",function(o,r,e,n,a){var t=function(o,r,e,a){$("#btnEnviar").button("reset"),n.error("Ocurrio un problema")};o.Aprobar=function(r){6!=r.estatus&&confirm("¿Desea aprobar el folio: "+r.identificador+"?")&&($("#btnApprove").button("loading"),a.responder(r.idAprobacion,1,o.observacion).success(i).error(t))};var i=function(o,e,a,t){0==o&&n.info("Aprobada Correctamente."),-1==o&&n.error("La solicitud fue aprobada previamente por otro autorizador."),$("#btnApprove").button("reset"),r.actualizar=!0,r.Reload()};o.Rechazar=function(r){6!=r.estatus&&confirm("¿Desea rechazar el folio: "+r.identificador+"?")&&(null!=o.observacion?($("#btnReject").button("loading"),a.responder(r.idAprobacion,0,o.observacion).success(c).error(t)):n.info("Debe incluir un comentario."))};var c=function(o,e,a,t){n.warning("Rechazada Correctamente."),$("#btnReject").button("reset"),r.actualizar=!0,r.Reload()};o.Revisar=function(e){6!=e.estatus&&confirm("¿Desea enviar a revisión el folio: "+e.identificador+"?")&&(null!=o.observacion?($("#btnCheck").button("loading"),r.currentNotificacion=e,a.responder(e.idAprobacion,2,o.observacion).success(u).error(t)):n.info("Debe incluir un comentario."))};var u=function(e,a,t,i){n.info("Enviado a Revisión Correctamente."),$("#btnReject").button("reset"),r.actualizar=!0,r.comentario=o.observacion,r.EnviarComentario(),r.Reload()};o.Aceptar=function(o){$("#btnAceptar").button("loading"),a.aceptar(o.idAprobacion).success(s).error(t)};var s=function(o,e,n,a){$("#btnAceptar").button("reset"),r.actualizar=!0,r.Reload()}});