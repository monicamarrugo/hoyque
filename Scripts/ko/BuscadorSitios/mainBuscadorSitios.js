$(document).ready(function () {  
    ko.applyBindings(new buscadorSitiosViewModel($("#modalHistory")));

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton
});