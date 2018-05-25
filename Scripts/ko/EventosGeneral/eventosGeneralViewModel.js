//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';
var urlApi = 'http://www.hoyque.co/sitexplorer/Controller';
//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';

function eventosGeneralViewModel() {
    var self = this;
    self.idSite= ko.observable();
    self.idEvent = ko.observable();
    self.nombreEvento = ko.observable();
    self.descripcionEvento = ko.observable();
    self.imagenEvento= ko.observable();
    self.fechaEvento = ko.observable();
    self.availableEvents = ko.observableArray([]);
    //evento inicializar
    self.Init = function () {
        
        self.idEvent(null);
        self.loadEvents();
    }
  

     self.loadEvents = function(){
        $.ajax({
            url: urlApi + '/RestController.php?view=getEvents&idSite={0}&idEvent={1}'.format("", ""),
            type: "GET",
            success: function (data) {
                if (data != null) {
                   self.availableEvents(data.data);
                }
                else {
                    alert("La consulta no produjo resultados");
                }
            },
            error: function (xhr, error, thrown) {
                self.message('Error al obtener evento: ' + xhr.statusText, 'Error');

            }
        });
    }

 

    self.clearForm = function () {
         self.idEvent(null);
        self.nombreEvento("");
        self.descripcionEvento("");
        self.imagenEvento(null);
        self.fechaEvento("");
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
ko.bindingHandlers.fileSrc = {
    init: function (element, valueAccessor) {
        ko.utils.registerEventHandler(element, "change", function () {
            var reader = new FileReader();

            reader.onload = function (e) {
                var value = valueAccessor();
                value(e.target.result);
            }

            reader.readAsDataURL(element.files[0]);
        });
    }
};

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
