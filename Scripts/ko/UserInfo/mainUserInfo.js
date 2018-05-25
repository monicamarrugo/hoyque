$(document).ready(function () {  
    getInfo();

    ko.applyBindings(new infoUserViewModel());

    var bootstrapButton = $.fn.button.noConflict()
    $.fn.bootstrapBtn = bootstrapButton
});