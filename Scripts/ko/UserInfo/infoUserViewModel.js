//var urlApi = 'http://69.175.103.163/~mariocorpas/ruta/Controller';
var urlApi = 'http://www.hoyque.co/sitexplorer/Controller';
//var urlApi = 'http://69.175.103.163/~mariocorpas/sitexplorer/Controller';

function infoUserViewModel() {
    var self = this;
    self.idSelectedSite = ko.observable()
   
    //evento inicializar
    self.Init = function () {
        self.idSelectedSite("");
    }
    
   

    //Punto de arranque
    self.Init();
}

