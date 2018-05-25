$(document).ready(function () {  
    ko.applyBindings(new comentariosViewModel());

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton
});