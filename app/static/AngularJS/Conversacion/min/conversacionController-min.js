registrationModule.controller("conversacionController",function(t,o,r,e,n,a,i){var c=function(t,o,r,e){$("#btnEnviar").button("reset"),a.error("Ocurrio un problema")};t.ShowChat=function(t){o.currentNotificacion=t,i.get(t.id).success(u).error(c)};var u=function(t,r,e,n){o.listaConversacion=t,$("#modalChat").modal("show"),o.currentNotificacion.chatPendiente>0&&i.update(o.currentEmployee,o.currentNotificacion.idAprobacion).error(c),setTimeout(function(){$("#chat").animate({scrollTop:$("#bottom").offset().top},2e3)},500)};o.EnviarComentario=function(){var t=""!=$("textarea#txtComentario").val()?$("textarea#txtComentario").val():o.comentario;t.length>0&&($("#btnEnviar").button("loading"),i.add(o.currentNotificacion.id,o.currentEmployee,t).success(l).error(c))};var l=function(t,r,e,n){a.success("Comentarios registrados."),$("#btnEnviar").button("reset"),$("#modalChat").modal("hide"),$("textarea#txtComentario").val(""),o.actualizar=!0,o.Reload()}});