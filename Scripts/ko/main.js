$(document).ready(function () {  
    ko.applyBindings(new ViewModel($("#modalMateriaPrima")));

    var bootstrapButton = $.fn.button.noConflict() // return $.fn.button to previously assigned value
    $.fn.bootstrapBtn = bootstrapButton


    
});