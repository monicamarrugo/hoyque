$(document).ready(function () {  
    ko.applyBindings(new buscadorSitiosAdminViewModel());

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton
});