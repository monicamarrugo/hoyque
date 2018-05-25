//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';
var urlApi = 'http://www.hoyque.co/sitexplorer/Controller';
//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';

function eventoViewModel(modalHistory) {
    var self = this;
    self.idSite= ko.observable();
    self.idSelectedHistory = ko.observable();
    self.titleSelectedHistory = ko.observable();
    self.availablesHistories = ko.observableArray([]);
    self.availablesFilesHistory = ko.observableArray([]);
    //evento inicializar
    self.Init = function () {
        self.idSite(getParameterByName('idSite'));
        self.loadHistories();
    }
  
    self.mostrarHistoria = function (data) {
        self.idSelectedHistory(data.id);
        self.titleSelectedHistory(data.titulo);
        self.loadFilesHistory();
    }
    self.loadFilesHistory = function () {
        $.ajax({
            url: urlApi + '/RestController.php?view=getFilesHistory&idSite={0}&idHistory={1}'.format(self.idSite(), self.idSelectedHistory()),
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
    self.loadHistories = function () {
        $.ajax({
            url: urlApi + '/RestController.php?view=getHistories&idSite={0}&idHistory={1}'.format(self.idSite(), ""),
            type: "GET",
            success: function (data) {
                if (data != null) {
                    self.availablesHistories(data.data);
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
                'background-image': 'url(' + $src + ')',
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

            }
        });
        $(".carouselHistory .carousel-inner .item").on('click', function () {
            $('.carouselHistory').carousel('next');
        });
        var $pnlCarousel = $('.carouselHistory');
        $pnlCarousel.addClass('carousel slide');

        modalHistory.modal('show');
        /*var $item = $('.carouselHistory .item');
        var $wHeight = $(window).height();
        $item.eq(0).addClass('active');
        $item.height($wHeight);
        $item.addClass('full-screen');  

        $('.carouselHistory img').each(function () {
            var $src = $(this).attr('src');
            var $color = $(this).attr('data-color');
            $(this).parent().css({
                'background-image': 'url(' + $src + ')',
                'background-color': $color
            });
            $(this).remove();
        });
      $(window).on('resize', function () {
            $wHeight = $(window).height();
            $item.height($wHeight);
        });

        $('.carouselHistory').carousel({
            interval: 6000,
            pause: "false"
        });

		
		
        $('.carouselHistory').on('slide.bs.carousel', function () {
            if ($(".carouselHistory .carousel-inner .item:last").hasClass("active")) {
                $('.carouselHistory').carousel('pause');
                modalHistory.modal('hide');
              //  self.loadComments();
            }
        });
		
        modalHistory.modal('show');*/

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
