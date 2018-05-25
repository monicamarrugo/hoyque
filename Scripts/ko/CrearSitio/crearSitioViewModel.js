//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';
var urlApi = 'http://www.hoyque.co/sitexplorer/Controller';
//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';

function crearSitioViewModel() {
    var self = this;
    self.src = ko.observable();
    self.srcImg2 = ko.observable();
    self.srcImg3 = ko.observable();
    self.srcLogo = ko.observable();
    self.selectedCity = ko.observable();
    self.selectedCategory = ko.observable();
    self.idSite = ko.observable();
    self.nombre = ko.observable();
    self.resena = ko.observable();
    self.availableCities = ko.observableArray([]);
    self.availableSlides = ko.observableArray([]);
    self.availableCategories = ko.observableArray([]);
    self.uploadName = ko.computed(function() {
    return !!self.src() ? self.src().name : '-';
  });
    //evento inicializar
    self.Init = function () {
        self.idSite("");
        self.src("assets/img/form/thumbnail.PNG");
        self.srcLogo("assets/img/form/thumbnail.PNG");
        self.srcImg2("assets/img/form/thumbnail.PNG");
        self.srcImg3("assets/img/form/thumbnail.PNG");
        self.loadCities();
        self.loadCategories();
    }
    self.clearForm = function () {
        self.src(null);
        self.srcImg2(null);
        self.srcImg3(null);
        self.srcLogo(null);
        self.src("assets/img/form/thumbnail.PNG");
        self.srcImg2("assets/img/form/thumbnail.PNG");
        self.srcImg3("assets/img/form/thumbnail.PNG");
        self.srcLogo("assets/img/form/thumbnail.PNG");
        self.selectedCity(null);
        self.selectedCategory(null);
        self.nombre("");
        self.resena("");
    }
    
    self.loadCities = function(){
        $.ajax({
            url: urlApi + '/RestController.php?view=getCities',
            type: "GET",
            success: function (data) {
                if (data != null) {
                    cities = data.data;
                    self.availableCities(cities);
                }
                else {
                    alert("La consulta no produjo resultados");
                }
            },
            error: function (xhr, error, thrown) {
                self.message('Error al obtener ciudades: ' + xhr.statusText, 'Error');

            }
        });
    }
    self.loadCategories = function(){
        $.ajax({
            url: urlApi + '/RestController.php?view=getCategories',
            type: "GET",
            success: function (data) {
                if (data != null) {
                    categories = data.data;
                    self.availableCategories(categories);
                }
                else {
                    alert("La consulta no produjo resultados");
                }
            },
            error: function (xhr, error, thrown) {
                self.message('Error al obtener ciudades: ' + xhr.statusText, 'Error');

            }
        });
    }
    self.saveSite = function(){
       $.ajax({
            url: urlApi + '/RestController.php?view=saveSite',
            type: "POST",
            data: JSON.stringify({ "id":self.idSite(), "idCiudad": self.selectedCity(),"idCategoria":self.selectedCategory(), "nombre": self.nombre(), "resena": self.resena() }),
            success: function (data) {
                self.idSite(data.data[0].idSitio);
                self.saveSlide();
            },
            error: function () {
                self.message("Error al intentar guardar el sitio", 'Error')
            }
        });
    }

    self.saveSlide = function(){
       $.ajax({
            url: urlApi + '/RestController.php?view=saveFiles',
            type: "POST",
            data: JSON.stringify([
                    { "idSitio": self.idSite(),"cdArchivo":"LOGO", "strbase64": self.srcLogo() },
                    { "idSitio": self.idSite(),"cdArchivo":"SLIDE1", "strbase64": self.src() },
                    { "idSitio": self.idSite(),"cdArchivo":"SLIDE2", "strbase64": self.srcImg2() },
                    { "idSitio": self.idSite(),"cdArchivo":"SLIDE3", "strbase64": self.srcImg3() }
            ]),
            success: function (data) {
                self.message("Sitio Guardado Exitosamente!", 'Succes')
                self.clearForm();
            },
            error: function () {
                self.message("Error al intentar guardar slides", 'Error')
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
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
