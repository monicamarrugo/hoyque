var urlApi = 'http://www.hoyque.co/sitexplorer/Controller';
var map;
var marker;
var marcadores = [];
function mapaViewModel() {
    var self = this;
    self.idSelectedSite = ko.observable()

    //evento inicializar
    self.Init = function () {
        self.idSelectedSite("");
         self.getubications();
        
    }

    self.getubications = function () {
        $.ajax({
            url: urlApi + '/RestController.php?view=getSites&idSite={0}&idCategory={1}'.format("", ""),
            type: "GET",
            success: function (data) {
                if (data != null) {
                    datas = data.data;

                    $.each(datas, function (idx, val) {
                        var formato = '<div id="content"><div id="siteNotice"></div><h3 id="firstHeading" class="firstHeading">{0}</h3><div id="bodyContent">' +
                            ' <a href="singleSite.html?idSite={1}">' +
                            'Ver...</a> ' +
                            '</div>' +
                            '</div>'.format(val.name, val.id);
                        marcadores.push([formato, val.latitud, val.longitud]);
                    });
                    google.maps.event.addDomListener(window, 'load', self.initialize());
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

    self.initialize = function () {

       
        var mapOptions = {
            zoom: 15,//zoom empieza el mapa
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);//creamos un nuevo objeto de las librerias

        // Try HTML5 geolocation
        if (navigator.geolocation) //si acepta la geolocalizacion
        {
            navigator.geolocation.getCurrentPosition(function (position) {


                var idSitio = getParameterByName('idSitio');
                var pos;

                var infowindow = new google.maps.InfoWindow();  // lo acbo de borrar 24/02/2018
                var marker, i;
                

                if (idSitio !== null && idSitio !== undefined && idSitio !== "") {

                    var nombreSitio = getParameterByName('nombreSitio');
                    var latitud = getParameterByName('latitud');
                    var longitud = getParameterByName('longitud');


                    pos = new google.maps.LatLng(latitud, longitud);
                }
                else {
                    pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);//generamos una nueva posicion en 
                }
                //formato  latitude,longitude

                var goldStar = {//creamos las propiedades para un nuevo marcador
                    path: google.maps.SymbolPath.CIRCLE,
                    strokeColor: '#276ED0',
                    fillColor: '#276ED0',
                    fillOpacity: .9,
                    strokeWeight: 1,
                    scale: 6,
                };
                var marker = new google.maps.Marker({//creamos un nuevo marcador con las propiedades de goldstar
                    position: pos,//lo posicionamos con alguna ubicacion
                    icon: goldStar,//con las propiedades previemente creadas
                    draggable: true,//le dmos la propiedad de arrastrar el marcador
                    animation: google.maps.Animation.DROP,//propiedad de animacion
                    map: map,
                });

                map.setCenter(pos);//pocisionamos el marcador en el centro

                for (i = 0; i < marcadores.length; i++) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(marcadores[i][1], marcadores[i][2]),
                        map: map
                    });
                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            infowindow.setContent(marcadores[i][0]); // lo acbo de borrar 24/02/2018
                            infowindow.open(map, marker);
                        }
                    })(marker, i));
                }

            }, function () //excepciones
                {
                    handleNoGeolocation(true);
                });
        }
        else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    }

    //Punto de arranque
    self.Init();
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
String.prototype.format = function () {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
    }
    return str;
}
function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    }
    else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

