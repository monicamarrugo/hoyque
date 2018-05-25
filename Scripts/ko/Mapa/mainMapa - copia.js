$(document).ready(function () {  
    ko.applyBindings(new mapaViewModel());

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton
});