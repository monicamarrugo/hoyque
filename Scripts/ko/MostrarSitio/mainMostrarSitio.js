$(document).ready(function () {  
    ko.applyBindings(new mostrarSitioViewModel($("#modalHistory")));

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton

     
});