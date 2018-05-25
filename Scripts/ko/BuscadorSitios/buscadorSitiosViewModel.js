//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';
var urlApi = 'http://www.hoyque.co/sitexplorer/Controller';
var urlFile = 'http://www.hoyque.co/sitexplorer/DataSites/';
//var urlApi = 'http://69.175.103.163/~mariocorpas/sitexplorer/Controller';

function buscadorSitiosViewModel(modalHistory) {
    var self = this;
    self.idSelectedSite = ko.observable()   
    self.selectedCategory = ko.observable();
    self.currentView = ko.observable();
    self.availableSites = ko.observableArray([]);
    self.sitesCategory = ko.observableArray([]);
    self.availablesHistories = ko.observableArray([]);
    self.availablesFilesHistory = ko.observableArray([]);
    self.titleSelectedHistory = ko.observable();
    //evento inicializar
    self.Init = function () {
        self.idSelectedSite("");
        self.selectedCategory(getParameterByName('idCategory'));
        self.currentView(getParameterByName('view'));
       
          self.InitTableSitios();
          $("."+self.currentView().toString()).addClass("current");
           $(".current .imgPalm").attr("src","assets/img/design/iconPalmBc.png");
           $(".current .imgSports").attr("src","assets/img/design/iconSports_c.png");
    }
     self.InitTableSitios = function () {
        $('#tblSitios').DataTable({
            ajax: {
                url: urlApi + '/RestController.php?view=getSites&idSite={0}&idCategory={1}'.format(self.idSelectedSite(), self.selectedCategory()),
                type: 'GET',
                dataSrc: 'data',
                error: function (xhr, error, thrown) {
                    var error = JSON.parse(xhr.responseText);
                    self.message(error.statusText, 'Error');

                }
            },
            columns: [
                { "data": "id"},
                { "data": "name" },
                { "data": null},
                { "data": null}

            ],
            columnDefs: [
                {
                    "targets": 2,
                    "mRender": function (data, type, row, meta) {
                        return "<a title='Ver' href= 'singleSite.html?idSite="+ row.id +"'>"+row.name+"</a>";
                    }
                },
                {
                    "targets": 3,
                    "mRender": function (data, type, row, meta) {
                        return '<a title="Historias" class="lnkHistories">'+
                        '<i class="fa fa-film fa-2x"></i></a>';
                    }
                },
                { visible: false, "targets": [0,1] }
            ],
            responsive: true,
            language: {
                lengthMenu: "Mostrar _MENU_ Sitios",
                search: "Buscar:",
                info: "Mostrando _START_ a _END_ de _TOTAL_ Sitios",
                infoFiltered: "(filtrado de _MAX_ Sitios en total)",
                infoEmpty: "",
                zeroRecords: "No se encontraron Sitios que cumplan con el criterio de busqueda establecido",
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

        $('#tblSitios tbody').on('click', '.lnkHistories', function () {
            var data = $('#tblSitios').DataTable().row($(this).parents('tr')).data();
            self.idSelectedSite(data.id);
            self.loadHistories();
        });
    }
    self.loadHistories = function () {
        $.ajax({
            url: urlApi + '/RestController.php?view=getHistories&idSite={0}&idHistory={1}'.format(self.idSelectedSite(), ""),
            type: "GET",
            success: function (data) {
                if (data != null) {
                    self.availablesHistories(data.data);
                    self.mostrarHistorias();
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
     self.mostrarHistorias = function () {
         if(self.availablesHistories().length <= 0 )
            return;
            waitingDialog.show('Cargando...', {dialogSize: 'sm'});
        var current = self.availablesHistories.shift();
        self.titleSelectedHistory(current.titulo);
        self.loadFilesHistory(current.id);
    }
    self.loadCarousel = function () {
        var $item = $('.carouselHistory .item');
        var $wHeight = $(window).height();
        $item.eq(0).addClass('active');
        $item.height($wHeight);
        $item.addClass('full-screen');

        $('.carouselHistory img').each(function () {
            var $src = $(this).attr('src');
            var $color = $(this).attr('data-color');
            $(this).parent().css({
                'background-image': 'url(' + urlFile + $src + ')',
                'background-color': $color
            });
            $(this).remove();
        });

        $('.carouselHistory').on('slide.bs.carousel', function () {
            if ($(".carouselHistory .carousel-inner .item:last").hasClass("active")) {
                $('.carouselHistory').carousel('pause');
                var $pnlCarousel = $('.carouselHistory');
                $pnlCarousel.removeClass('carousel slide');
                $('.carouselHistory .item').remove();

                modalHistory.modal('hide');
                self.mostrarHistorias();
            }
        });
        $(".carouselHistory .carousel-inner .item").on('click', function () {
            $('.carouselHistory').carousel('next');
        });
        var $pnlCarousel = $('.carouselHistory');
        $pnlCarousel.addClass('carousel slide');
        waitingDialog.hide();
        modalHistory.modal('show');
    

    }
    self.loadFilesHistory = function (idCurrentHistory) {
        $.ajax({
            url: urlApi + '/RestController.php?view=getFilesHistory&idSite={0}&idHistory={1}'.format(self.idSelectedSite(), idCurrentHistory),
            type: "GET",
            success: function (data) {
                if (data != null) {
                    self.availablesFilesHistory(data.data);
                    self.loadCarousel();

                }
                else {
                    alert("La consulta no produjo resultados");
                }
            },
            error: function (xhr, error, thrown) {
                self.message('Error al obtener archivos de historia: ' + xhr.statusText, 'Error');

            }
        });
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

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
			'</div>' +
		'</div></div></div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null // This callback runs after the dialog was hidden
			}, options);

			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar');
			if (settings.progressType) {
				$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
			}
			$dialog.find('h3').text(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);
