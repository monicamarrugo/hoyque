var _TablaInit = {
    "columns": [
        { "data": null },
        { "data": "prodProdID" },
        { "data": "prodProdName" },
        { "data": "formuleId" },
        { "data": "layerCubeId" },
        { "data": "layerId" }

    ],

    "processing": true,
    "serverSide": true,
    "searching": false,
    "ordering": false,
    "language": {
        "lengthMenu": "Mostrar _MENU_ Productos",
        "search": "Buscar:",
        info: "Mostrando _START_ a _END_ de _TOTAL_ Productos",
        infoFiltered: "(filtrado de _MAX_ documentos en total)",
        infoEmpty: "",
        zeroRecords: "No se encontraron productos que cumplan con el criterio de busqueda establecido",
        paginate: {
            first: "<< Primero",
            previous: "< Anterior",
            next: "Siguiente >",
            last: "Ultimo >>"
        },
        "processing": " "
    },
    "columnDefs": [
                    {
                        "targets": 0,
                        "mRender": function (data) {
                            return "<button type='button' class='btn-editar' title='Editar'><i class='glyphicon glyphicon-eye-open'></i></button>"
                        }
        },
                    {
                        "targets": [4,5],
                        "isVisible": false
                    }
            
                 ]
}

var _TablaInitMateria = {
    "columns": [
        { "data": "itemMasterCode" },
        { "data": "shortDescription" },
        { "data": "basePercent" },
        { "data": "layerPercent" }
    ],

    "processing": true,
    "serverSide": true,
    "searching": false,
    "ordering": false,
    "language": {
        "lengthMenu": "Mostrar _MENU_ Items",
        "search": "Buscar:",
        info: "Mostrando _START_ a _END_ de _TOTAL_ Items",
        infoFiltered: "(filtrado de _MAX_ documentos en total)",
        infoEmpty: "",
        zeroRecords: "No se encontraron productos que cumplan con el criterio de busqueda establecido",
        paginate: {
            first: "<< Primero",
            previous: "< Anterior",
            next: "Siguiente >",
            last: "Ultimo >>"
        },
        "processing": " "
    }
}


