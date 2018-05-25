//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';
var urlApi = 'http://www.hoyque.co/sitexplorer/Controller';
//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';

function comentariosViewModel() {
    var self = this;
    self.idSite= ko.observable();
    self.commentsSite = ko.observableArray([]);
    self.commentHistory =ko.observable();
    self.nombreUsuario = ko.observable(null, {persist: 'userName'});
    //evento inicializar
    self.Init = function () {
        self.idSite(getParameterByName('idSite'));
        self.loadComments();
    }
  
     self.loadComments = function () {
        $.ajax({
            url: urlApi + '/RestController.php?view=getComments&idSite={0}&idComentario={1}&idHistory={2}&idArchivo={3}'.format(self.idSite(), "", "", ""),
            type: "GET",
            success: function (data) {
                if (data != null) {
                    self.commentsSite(data.data);
                }
                else {
                    alert("La consulta no produjo resultados");
                }
            },
            error: function (xhr, error, thrown) {
                self.message('Error al obtener comentarios: ' + xhr.statusText, 'Error');

            }
        });
    }

    self.sendComment = function (file) {
        if (self.commentHistory() === null || self.commentHistory() === undefined || self.commentHistory() === "")
            return;

        $.ajax({
            url: urlApi + '/RestController.php?view=saveComment',
            type: "POST",
            data: JSON.stringify({
                "idSitio": self.idSite(),
                "idHistoria": "",
                "idArchivo": "",
                "nombreUsuario":self.nombreUsuario(),
                "descripcion": self.commentHistory()
            }),
            success: function (data) {
                self.commentHistory("");
                self.loadComments();
            },
            error: function () {
                self.message("Error al intentar guardar el comentario", 'Error')
            }
        });
    }

    self.message = function (Message, Type) {
        switch (Type) {
            case 'Info':
                $('.alert-info').css("padding", "15px");
                $('.alert-info').css("border", "1px solid transparent");
                $('.alert-info').css("border-radius", "4px");
                $(".alert-info").html(Message).fadeIn(300).delay(2500).fadeOut(400);
                break;
            case 'Error':
                $('.alert-danger').css("padding", "15px");
                $('.alert-danger').css("border", "1px solid transparent");
                $('.alert-danger').css("border-radius", "4px");
                $(".alert-danger").html(Message).fadeIn(300).delay(25000).fadeOut(400);
                break;
            case 'Succes':
                $('.alert-success').css("padding", "15px");
                $('.alert-success').css("border", "1px solid transparent");
                $('.alert-success').css("border-radius", "4px");
                $(".alert-success").html(Message).fadeIn(300).delay(2500).fadeOut(400);
                break;
        }
    }
    //Punto de arranque
    self.Init();
}


String.prototype.format = function () {
        var str = this;
        for (var i = 0; i < arguments.length; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            str = str.replace(reg, arguments[i]);
        }
        return str;
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
