var url = '/api/DataFormulations';
var urlApiHomologous = '/api/DataHomologous';
var PageNum = 0;
var canvas, context, tool;
var myRect = [];


function ViewModel(modalGraph) {
    var self = this;
    var sPlanta = document.getElementById("slPlanta");
    self.isLoading= ko.observable(false);
    canvas = document.getElementById('canvasLayer');
    context = canvas.getContext('2d');
    self.tblFormulaciones = ko.observable();
    self.tblMateriaPrima = ko.observable();
    self.canvasLayer = ko.observable();
    self.producto = ko.observable();
    self.nombreProducto = ko.observable();
    self.anioFormula = ko.observable();
    self.titleLayers = ko.observable();
    self.description = ko.observable();
    self.descriptionLayer = ko.observable();
    self.titleLayersMateria = ko.observable();
    self.selectedProduct = ko.observable();
    self.toggleSlide = function (data, event) {
        $(event.currentTarget).next().slideToggle();
    };
    self.Init = function () {
          self.GenTable();
          self.GenTableMateria();
        $('#tblFormulaciones tbody').on('click', '.btn-editar', function () {
            var data = $('#tblFormulaciones').DataTable().row($(this).parents('tr')).data();           
            self.getLayers(data);
        });      
    }

    self.GenTable = function () {
        $('#tblFormulaciones').DataTable({
            ajax: {
                url: self.getUrl(),
                dataSrc: 'data'
            },
            columns: [
                { "data": null },
                { "data": "prodProdID" },
                { "data": "prodProdName" },
                { "data": "formuleComment" },
                { "data": "formuleYear" },
                { "data": "formuleId" }
            ],
            responsive: true,
            select:true,
            columnDefs: [
                {
                    "targets": 0,
                    "mRender": function (data) {
                        return "<button type='button' class='btn-editar' title='Editar'><i class='fa fa-eye'></i></button>"
                    }
                }

            ],
            language: {
                lengthMenu: "Mostrar _MENU_ Productos",
                search: "Buscar:",
                info: "Mostrando _START_ a _END_ de _TOTAL_ Productos",
                infoFiltered: "(filtrado de _MAX_ productos en total)",
                infoEmpty: "",
                zeroRecords: "No se encontraron productos que cumplan con el criterio de busqueda establecido",
                paginate: {
                    first: "<< Primero",
                    previous: "< Anterior",
                    next: "Siguiente >",
                    last: "Ultimo >>"
                },
                processing: "Procesando..."
            },
        });
        $('#tblFormulaciones').DataTable().columns([5]).visible(false, false);

    }
    self.GenTableMateria = function () {
        $('#tblMateriaPrima').DataTable({
            columns: [
                { "data": "itemMasterCode" },
                { "data": "shortDescription" },
                { "data": "basePercent" },
                { "data": "layerPercent" }
            ],
            responsive: true,
            select:true,
            columnDefs: [
                {
                    "targets": 0,
                    "mRender": function (data) {
                        return "<a href='#' class='btn_toggle'>" + data + "</a>";
                    }
                }

            ],
            language: {
                lengthMenu: "Mostrar _MENU_ Resinas",
                search: "Buscar:",
                info: "Mostrando _START_ a _END_ de _TOTAL_ Resinas",
                infoFiltered: "(filtrado de _MAX_ Resinas en total)",
                infoEmpty: "",
                zeroRecords: "No se encontraron Resinas que cumplan con el criterio de busqueda establecido",
                paginate: {
                    first: "<< Primero",
                    previous: "< Anterior",
                    next: "Siguiente >",
                    last: "Ultimo >>"
                },
                processing: "Procesando..."
            },
        });

        $('#tblMateriaPrima tbody').on('mouseover', '.btn_toggle', function () {
            var data = $('#tblMateriaPrima').DataTable().row($(this).parents('tr')).data();
            var planta = sPlanta.options[sPlanta.selectedIndex].value;

            var urlParams = "/GetHomologous?productID={0}&itemMasterCode={1}&plantId={2}".format(self.selectedProduct(), data.itemMasterCode, planta);

            $.get(
                urlApiHomologous + urlParams
                , function (data) {

                    if (data != null) {
                        var datos = data.data;
                        var tag = '<p>';
                        if (datos.length < 1) {
                            tag = 'La resina no posee homólogos';
                        }
                        for (var i = 0; i < datos.length; i++) {
                            tag += '{0}, '.format(datos[i].itemHomologouDescription);
                        }
                        
                        tag += '</p>';
                        $('#contentHomologos').html(tag);
                        $('#divHomologo').slideToggle();
                    }
                    else {
                        alert("Error al cargar formula");
                    }
                }
                , 'json'
            ).fail(function () {
                $('#errorMessage').html("Error al cargar la formula por producto");
                $("#errorMessage").fadeIn(300).delay(2500).fadeOut(400);
                self.isLoading(false);
            });
         

        });
        $('#tblMateriaPrima tbody').on('mouseout', '.btn_toggle', function () {
            $('#divHomologo').slideToggle();

        });

    }
    
    self.getUrl = function () {
        var planta = sPlanta.options[sPlanta.selectedIndex].value;
        return url + "/GetProducts?plantId=" + planta;
    }
    self.buscar = function () {
        var requestUrl;     
        var planta = sPlanta.options[sPlanta.selectedIndex].value;
        requestUrl = "/GetProducts?productId={0}&productName={1}&formuleYear={2}&plantId={3}"
            .format(self.producto() != undefined ? self.producto() : "",
            self.nombreProducto(tr) != undefined ? self.nombreProducto() : "",
            self.anioFormula() != undefined ? self.anioFormula() : "",
            planta);

        $('#tblFormulaciones').DataTable().ajax.url(url + requestUrl);
        $('#tblFormulaciones').DataTable().ajax.reload();
              
    }
    self.limpiar = function () {
        self.producto("");
        self.anioFormula("");
        self.nombreProducto("");
        $('#tblFormulaciones').DataTable().ajax.url(self.getUrl());
        $('#tblFormulaciones').DataTable().ajax.reload();
    }
    self.message = function (Message, Type) {
        switch (Type) {
            case 'Info': $(".alert-info").html(Message).fadeIn(300).delay(2500).fadeOut(400);
                break;
            case 'Error': $(".alert-danger").html(Message).fadeIn(300).delay(25000).fadeOut(400);
                break;
            case 'Succes': $(".alert-success").html(Message).fadeIn(300).delay(2500).fadeOut(400);
                break;
        }
    }
    self.getLayers = function (data) {
        self.selectedProduct(data.prodProdID);
        self.titleLayers("{0}: {1}".format(data.prodProdID, data.prodProdName));
        self.description("<p>{0}</p>".format(data.formuleComment));
        var planta = sPlanta.options[sPlanta.selectedIndex].value;
        $.get(
            url + '/GetFormuleByProduct?productId=' + data.prodProdID + "&formuleId=" + data.formuleId + "&plantId=" + planta
            , function (data) {

                if (data != null) {
                    var datos = data.data;
                    context.clearRect(0, 0, canvas.width, canvas.height)
                    
                  self.drawLayer(datos);
                  self.isLoading(false);
                }
                else {
                    alert("Error al cargar formula");
                }
            }
            , 'json'
        ).fail(function () {
            $('#errorMessage').html("Error al cargar la formula por producto");
            $("#errorMessage").fadeIn(300).delay(2500).fadeOut(400);
            self.isLoading(false);
        });
    }
    self.drawLayer = function (datos) {
       
       myRect = [];
       var t1;
       $('#tblMateriaPrima').DataTable().clear().draw();
       context.clearRect(0, 0, canvas.width, canvas.height);
       self.titleLayersMateria("");
       self.descriptionLayer("");
       var nameLayer;
       var desLayerName;
       var description = "Descripcion";
       var planta = sPlanta.options[sPlanta.selectedIndex].value;

       for (var i = 0; i < datos.length; i++) {

            nameLayer = datos[i].layerName;
            desLayerName = datos[i].desLayerName;
            var description = "Nombre capa : {0}<br/>Espesor de capa: {1}<br/>Tratamiento: {2}<br/>".format(desLayerName, datos[i].formuleLayerGross, datos[i].treatmentName);               
            var requestUrl = "/GetFormuleByLayer?layerCube={0}&layerId={1}&productId={2}&formuleId={3}".format(datos[i].layerCubeId, datos[i].layerId, datos[i].prodProdID, datos[i].formuleId);

            switch (nameLayer) {
                case 'Core':
                    myRect.push(new Shape(canvas.width / 8, 2.1, canvas.width, canvas.height, "#ffcc33", 0.8, desLayerName, description, requestUrl));                    
                    break;

                case 'Externa':
                    myRect.push(new Shape(canvas.width / 8, 4, canvas.width, canvas.height, "#4682b4", 0.8, desLayerName, description, requestUrl));
                    break;

                case 'Interna':
                    myRect.push(new Shape(canvas.width / 8, 1.4, canvas.width, canvas.height, "#bbbbbb", 0.8, desLayerName, description, requestUrl));                    
                    break;

                case 'Intermedia 4':
                    myRect.push(new Shape(canvas.width / 8, 1.68, canvas.width, canvas.height, "#999900", 0.8, desLayerName, description, requestUrl));
                    break;

                case 'Intermedia 2':
                    myRect.push(new Shape(canvas.width / 8, 2.8, canvas.width, canvas.height, "#00bb00", 0.8, datos[i].desLayerName, description, requestUrl));
                    break;
            }

        }
          
       var img = new Image();
       var vwidth, vheight;
       img.src = "../../Content/images/capas.png";
       img.onload = function () {

           context.drawImage(img, canvas.width / 8, canvas.height / 6);

           for (var j in myRect) {
               oRec = myRect[j];
               context.fillStyle = oRec.fill;
               context.fillRect(img.width, img.width / oRec.y, img.width / 10, img.width / 10);
               context.closePath();
               context.fill();
               region = { x: img.width, y: img.width / oRec.y, w: img.width / 10, h: img.width / 10 };
               var rUrl = url + oRec.requestUrl;
               t1 = new ToolTip(canvas, region, oRec.description, 130, 3000, rUrl, oRec.fill, oRec.nameLayer);
                canvas.addEventListener("click", t1.check);
           }
       };
       
        modalGraph.modal("show");    
    }
   
    function Shape(x, y, w, h, fill, opacity, nameLayer, description, requestUrl) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fill = fill;
        this.opacity = opacity;
        this.nameLayer = nameLayer;
        this.description = description;
        this.requestUrl = requestUrl;
    }

    function ToolTip(canvas, region, text, width, timeout, requestUrl, color, nameLayer) {

        var me = this,             
            visible = false;                                             
        
        this.show = function (pos) {
            self.descriptionLayer(text);
            self.titleLayersMateria(nameLayer);
            $('#divDescription').css("color", color);
            var planta = sPlanta.options[sPlanta.selectedIndex].value;
            rUrl = requestUrl + "&plantId={0}".format(planta);
            MateriaPrima(rUrl);
        }

        
        function hide() {
            visible = false;                            
            parent.removeChild(div);                               
        }

        
        this.check= function(e) {
            var pos = getPos(e),
                posAbs = { x: e.clientX, y: e.clientY };  
            if (pos.x >= region.x && pos.x < region.x + region.w &&
                pos.y >= region.y && pos.y < region.y + region.h) {
                me.show(pos); 
                
            }
            else setDivPos(pos);                     
        }

        function getPos(e) {

            var r = canvas.getBoundingClientRect();
            return { x: e.clientX - r.left, y: e.clientY - r.top }
        }

       
        function setDivPos(pos) {

            if (visible) {
                if (pos.x < 0) pos.x = 0;
                if (pos.y < 0) pos.y = 0;

                div.style.left = pos.x + "px";
                div.style.top = pos.y + "px";
            }
        }

    }

    function MateriaPrima(requestUrl) {

        if ($.fn.dataTable.isDataTable('#tblMateriaPrima')) {
            $('#tblMateriaPrima').DataTable().ajax.url(requestUrl);
            $('#tblMateriaPrima').DataTable().responsive = true;
            $('#tblMateriaPrima').DataTable().ajax.reload();
        } else {
           self.GenTableMateria();
        }

    }

    String.prototype.format = function () {
        var str = this;
        for (var i = 0; i < arguments.length; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            str = str.replace(reg, arguments[i]);
        }
        return str;
    }

    self.formatDetail= function (data) {
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>Hola</td>' +
            '<td>Hola</td>' +
            '</tr>'+
            '</table>';
    }

    self.Init();
}
