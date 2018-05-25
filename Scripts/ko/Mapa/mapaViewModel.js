var urlApi = 'http://www.hoyque.co/sitexplorer/Controller';
var map;
var marker;
var marcadores = [];
function mapaViewModel() {
    var self = this;
    

    //evento inicializar
    self.Init = function () {
        self.idSelectedSite("");
         self.getubications();
        
    }

}