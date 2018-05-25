$(document).ready(function () {  
    ko.applyBindings(new adminSitioViewModel());

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton
});