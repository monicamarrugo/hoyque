$(document).ready(function () {  
    ko.applyBindings(new eventosGeneralViewModel());

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton
});