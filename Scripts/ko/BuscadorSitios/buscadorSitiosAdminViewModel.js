//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';
//var urlApi = 'http://localhost/sitexplorer/Controller';
var urlApi = 'http://69.175.103.163/~asanchezo21/sitexplorer/Controller';

function buscadorSitiosAdminViewModel() {
    var self = this;
    self.idSelectedSite = ko.observable()
    self.selectedCategory = ko.observable()
    self.availableCategories = ko.observableArray([]);
    self.availableSites = ko.observableArray([]);
    self.sitesCategory = ko.observableArray([]);
    //evento inicializar
    self.Init = function () {
        self.idSelectedSite("");
        self.loadCategories();
    }
    self.categoryChanged = function (category) {
        self.selectedCategory(category.id);
        self.loadSitesByCategory();
    }
    
    self.loadSitesByCategory = function () {
        $.ajax({
             url: urlApi + '/RestController.php?view=getSites&idSite={0}&idCategory={1}'.format(self.idSelectedSite(), self.selectedCategory()),
            type: "GET",
            success: function (data) {
                self.availableSites(data.data);
                $('.typeahead').typeahead('destroy');
                $(".typeahead").typeahead({ 
                                            source: data.data, 
                                            autoSelect: true
                                        });
            },
            error: function () {
                self.message("Error al intentar obtener resultados", 'Error')
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
                    self.selectedCategory("");
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

    self.loadSites = function(){
        $.ajax({
            url: urlApi + "/RestController.php?view=getSites&idSite={0}&idCategory={1}".format(self.idSelectedSite(), self.selectedCategory()),
            type: "GET",
            success: function (data) {
                if (data != null) {
                    sites = data.data;
                    self.availableSites(sites);
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

     

    $(".typeahead").change(function () {
        var current = $(".typeahead").typeahead("getActive");
        if (current) {
            self.availableSites.removeAll();
            self.availableSites.push(current);
        } else {
           
        }
    });

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
