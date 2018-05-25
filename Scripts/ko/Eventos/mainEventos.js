$(document).ready(function () {  
    ko.applyBindings(new eventoViewModel($("#modalHistory")));

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton
});