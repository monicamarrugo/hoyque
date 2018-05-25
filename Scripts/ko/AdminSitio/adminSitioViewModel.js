//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';
// urlApi = 'http://localhost/sitexplorer/Controller';
var urlApi = 'http://www.hoyque.co/sitexplorer/Controller';

var fileHistory = function(idSitio, idHistoria, strbase64){
    this.idSitio = idSitio;
    this.idHistoria = idHistoria;
    this.strbase64 = strbase64;
}

function adminSitioViewModel() {
    var self = this;
    self.nombreSitio = ko.observable();
    self.slide1 = ko.observable();
    self.slide2 = ko.observable();
    self.slide3 = ko.observable();
    self.logo = ko.observable();
    self.resena = ko.observable();
    self.idSite = ko.observable();
     self.selectedCity = ko.observable();
    self.selectedCategory = ko.observable();
    self.availableSites = ko.observableArray([]);
    self.availableCities = ko.observableArray([]);
    self.availableCategories = ko.observableArray([]);
    self.availableFilesHistory = ko.observableArray([]);
    self.idEvent = ko.observable();
    self.nombreEvento = ko.observable();
    self.descripcionEvento = ko.observable();
    self.imagenEvento= ko.observable();
    self.fechaEvento = ko.observable();
    self.imagenHistory = ko.observable();
    self.titleHistory= ko.observable();
    self.idHistory= ko.observable();
    self.latitudSitio = ko.observable();
    self.longitudSitio = ko.observable();
    //evento inicializar
    self.Init = function () {
        self.idSite(getParameterByName('idSite'));
        self.idEvent(null);
        self.idHistory(null);
        self.imagenHistory(null)
        self.loadCities();
        self.loadCategories();
        self.loadSite();
        self.InitTableEventos();
        self.InitTableHistorias();
    }
    self.saveHistory = function(){
         $.ajax({
            url: urlApi + '/RestController.php?view=saveHistory',
            type: "POST",
            data: JSON.stringify({ "id":self.idHistory(), 
                "idSitio": self.idSite(),
                "titulo":self.titleHistory()
             }),
            success: function (data) {
                self.idHistory(data.data[0].idHistoria);

                    ko.utils.arrayForEach(self.availableFilesHistory(),function(element) {
                      element.idHistoria = self.idHistory();
                    });
                    self.saveImagesHistory();
                    self.clearFormHistory();
                     $('#tblHistorias').DataTable().ajax.reload();
            },
            error: function () {
                self.message("Error al intentar guardar la historia", 'Error')
            }
        });
    }

    self.saveImagesHistory = function(){
       $.ajax({
            url: urlApi + '/RestController.php?view=saveFiles',
            type: "POST",
            data: JSON.stringify(self.availableFilesHistory()),
            success: function (data) {
                self.message("Historia Creada Exitosamente!", 'Succes');
            },
            error: function () {
                self.message("Error al intentar guardar archivos de historia", 'Error')
            }
        });
    }
    self.clearFormHistory = function(){
        self.titleHistory("");
        self.availableFilesHistory.removeAll();
        self.imagenHistory();
        self.idHistory("");
    }

    self.addfile = function(){
        if(self.imagenHistory() === null)
            return;
        var file = new fileHistory(self.idSite(), null, self.imagenHistory());
        self.availableFilesHistory.push(file);
        self.imagenHistory(null);
    }
    self.removefile = function(file){
         self.availableFilesHistory.remove(file);
    }
    self.InitTableHistorias = function () {
        $('#tblHistorias').DataTable({
            ajax: {
                url: urlApi + '/RestController.php?view=getHistories&idSite={0}&idHistory={1}'.format(self.idSite(), ""),
                type: 'GET',
                dataSrc: 'data',
                error: function (xhr, error, thrown) {
                    var error = JSON.parse(xhr.responseText);
                    self.message(error.statusText, 'Error');

                }
            },
            columns: [
                { "data": null },
                { "data": "id" },
                { "data": "titulo"},
                { "data": "fechaCreacion"}

            ],
            columnDefs: [
                {
                    "targets": 0,
                    "mRender": function (data) {
                        return "<a class='btnEdit' title='Editar'><i class='fa fa-pencil'></i></a>";
                    }
                },
                { visible: false, "targets": [1] }
            ],
            responsive: true,
            language: {
                lengthMenu: "Mostrar _MENU_ Historias",
                search: "Buscar:",
                info: "Mostrando _START_ a _END_ de _TOTAL_ Historias",
                infoFiltered: "(filtrado de _MAX_ Historias en total)",
                infoEmpty: "",
                zeroRecords: "No se encontraron Historias que cumplan con el criterio de busqueda establecido",
                paginate: {
                    first: "<< Primero",
                    previous: "< Anterior",
                    next: "Siguiente >",
                    last: "Ultimo >>"
                },
                processing: "Procesando..."
            },
            iDisplayLength: 10
        });

        $('#tblHistorias tbody').on('click', '.btnEdit', function () {
            var data = $('#tblHistorias').DataTable().row($(this).parents('tr')).data();
         
        });
    }
    self.InitTableEventos = function () {
        $('#tblEventos').DataTable({
            ajax: {
                url: urlApi + '/RestController.php?view=getEvents&idSite={0}&idEvent={1}'.format(self.idSite(), ""),
                type: 'GET',
                dataSrc: 'data',
                error: function (xhr, error, thrown) {
                    var error = JSON.parse(xhr.responseText);
                    self.message(error.statusText, 'Error');

                }
            },
            columns: [
                { "data": null },
                { "data": "id" },
                { "data": "nombre"},
                { "data": "fecha"},
                { "data": "descripcion" },
                { "data": "fechaCreacion" }

            ],
            columnDefs: [
                {
                    "targets": 0,
                    "mRender": function (data) {
                        return "<a class='btnEdit' title='Editar'><i class='fa fa-pencil'></i></a>";
                    }
                },
                { visible: false, "targets": [1] }
            ],
            responsive: true,
            language: {
                lengthMenu: "Mostrar _MENU_ Eventos",
                search: "Buscar:",
                info: "Mostrando _START_ a _END_ de _TOTAL_ Eventos",
                infoFiltered: "(filtrado de _MAX_ Eventos en total)",
                infoEmpty: "",
                zeroRecords: "No se encontraron Eventos que cumplan con el criterio de busqueda establecido",
                paginate: {
                    first: "<< Primero",
                    previous: "< Anterior",
                    next: "Siguiente >",
                    last: "Ultimo >>"
                },
                processing: "Procesando..."
            },
            iDisplayLength: 10
        });

        $('#tblEventos tbody').on('click', '.btnEdit', function () {
            var data = $('#tblEventos').DataTable().row($(this).parents('tr')).data();
            self.idEvent(data.id);
            self.loadEvent();
        });
    }

     self.loadEvent = function(){
        $.ajax({
            url: urlApi + '/RestController.php?view=getEvents&idSite={0}&idEvent={1}'.format(self.idSite(),  self.idEvent()),
            type: "GET",
            success: function (data) {
                if (data != null) {
                    event = data.data[0];
                    self.nombreEvento(event.nombre);
                    self.descripcionEvento(event.descripcion);
                    self.imagenEvento(event.imagen);
                    self.fechaEvento(event.fecha);
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

    self.saveEvent = function(){
         $.ajax({
            url: urlApi + '/RestController.php?view=saveEvent',
            type: "POST",
            data: JSON.stringify({ "id":self.idEvent(), 
                "idSitio": self.idSite(),
                "nombre":self.nombreEvento(), 
                "fecha": self.fechaEvento(), 
                "descripcion": self.descripcionEvento()
             }),
            success: function (data) {
                self.idEvent(data.data[0].idEvento);
                if(self.idEvent === null || self.idEvent === undefined|| self.idEvent === "")
                    self.saveImageEvent();
                else
                    self.updateImageEvent();
            },
            error: function () {
                self.message("Error al intentar guardar el sitio", 'Error')
            }
        });
    }

    self.saveImageEvent = function(){
       $.ajax({
            url: urlApi + '/RestController.php?view=saveFiles',
            type: "POST",
            data: JSON.stringify([
                    { "idSitio": self.idSite(),"cdArchivo":"EVENT{0}".format(self.idEvent()), "strbase64": self.imagenEvento() }
            ]),
            success: function (data) {
                self.message("Evento Creado Exitosamente!", 'Succes');
                self.clearForm();
                 $('#tblEventos').DataTable().ajax.reload();
            },
            error: function () {
                self.message("Error al intentar guardar imagen", 'Error')
            }
        });
    }
    self.updateImageEvent = function(){
       $.ajax({
            url: urlApi + '/RestController.php?view=updateFiles',
            type: "POST",
            data: JSON.stringify([
                    { "idSitio": self.idSite(),"cdArchivo":"EVENT{0}".format(self.idEvent()), "strbase64": self.imagenEvento() }
            ]),
            success: function (data) {
                self.message("Evento Actualizado Exitosamente!", 'Succes')
                self.clearForm();
                 $('#tblEventos').DataTable().ajax.reload();
            },
            error: function () {
                self.message("Error al intentar actualizar imagen", 'Error')
            }
        });
    }

    self.loadSite = function(){
        $.ajax({
            url: urlApi + '/RestController.php?view=getSites&idSite={0}&idCategory={1}'.format(self.idSite(), " "),
            type: "GET",
            success: function (data) {
                if (data != null) {
                    site = data.data[0];
                    self.nombreSitio (site.name);
                    self.slide1(site.Slide1);
                    self.slide2(site.Slide2);
                    self.slide3(site.Slide3);
                    self.logo(site.Logo);
                    self.resena(site.resena);
                    self.selectedCity(site.idCiudad);
                    self.selectedCategory(site.idCategoria);
                    self.latitudSitio(site.latitud);
                    self.longitudSitio(site.longitud);
                }
                else {
                    alert("La consulta no produjo resultados");
                }
            },
            error: function (xhr, error, thrown) {
                self.message('Error al obtener sitios: ' + xhr.statusText, 'Error');

            }
        });
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
            data: JSON.stringify({ "id":self.idSite(), "idCiudad": self.selectedCity(),"idCategoria":self.selectedCategory(),
            "nombre": self.nombreSitio(), "resena": self.resena(), "latitud": self.latitudSitio(), "longitud": self.longitudSitio() }),
            success: function (data) {
                self.saveSlide();
            },
            error: function () {
                self.message("Error al intentar guardar el sitio", 'Error')
            }
        });
    }
    self.saveSlide = function(){
       $.ajax({
            url: urlApi + '/RestController.php?view=updateFiles',
            type: "POST",
            data: JSON.stringify([
                    { "idSitio": self.idSite(),"cdArchivo":"LOGO", "strbase64": self.logo() },
                    { "idSitio": self.idSite(),"cdArchivo":"SLIDE1", "strbase64": self.slide1() },
                    { "idSitio": self.idSite(),"cdArchivo":"SLIDE2", "strbase64": self.slide2() },
                    { "idSitio": self.idSite(),"cdArchivo":"SLIDE3", "strbase64": self.slide3() }
            ]),
            success: function (data) {
                self.message("Sitio Actualizado Exitosamente!", 'Succes')
                self.loadSite();
            },
            error: function () {
                self.message("Error al intentar guardar slides", 'Error')
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
