$(document).ready(function () {  
    ko.applyBindings(new crearSitioViewModel());

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton
});