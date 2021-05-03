var map;
var ui;
var idAnterior;

$(window).resize( () => resizeMap());

$(document).ready(function(){
    resizeMap();

    var platform = new H.service.Platform({
        'app_id': APP_ID,
        'app_code': APP_CODE,
        useHTTPS: true
    });
    var pixelRatio = window.devicePixelRatio || 1;
        
    var defaultLayers = platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ?  undefined : 320
    });

    map = new H.Map(
        $("#mapa")[0],
        defaultLayers.normal.map, 
        {pixelRatio: pixelRatio}
    );
    
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    ui = H.ui.UI.createDefault(map, defaultLayers);
    console.log(ui);
    var panorama = ui.getControl('panorama');
    goLeon(map); 

    $("#txtMapa").keyup(function(e){
        $.ajax({
            method: 'GET',
            url: HOST + '/city/' +($(this).val().trim()).replace(/ /g, ','),
            type:'json',
            success: function(a){
                loadResult(a);
            },
            fail: function(err){
                alert("Error: ",err);
            }
        });
        if(e.keyCode == 13){
            moveMap(latitude,longitude);
        }
        
    });

   
});


const loadResult = function(a){
    var resultados = "";
    if(a.response.view.length > 0 ){
        if(a.response.view[0].result.length > 0 ){
            latitude =  a.response.view[0].result[0].location.displayPosition.latitude;
            longitude = a.response.view[0].result[0].location.displayPosition.longitude;
            if(a.response.view[0].result.length > 1)
                resultados += "<ul class='list-group shadow' id='list'>";
                for(var i = 0; i < a.response.view[0].result.length; i++){
                    (a.response.view[0].result[i].location.address.label != null)? 
                    resultados += "<li class='list-group-item' id='opcion"+(i+1)+"' onclick='selection("+(i+1)+")' data-contenido"+(i+1)+"='"+a.response.view[0].result[i].location.address.label+"'>"+a.response.view[0].result[i].location.address.label+"</li>" 
                    : resultados +=  "";
                }
            resultados += "</ul>";
        }
        $("#divResultados").html(resultados);
    }
}



const moveMap = function(lat, lng){
    map.setCenter({
        lat:lat, 
        lng:lng
    });
    map.setZoom(12);
}

const goLeon = function(map){
    map.setCenter({
        lat:21.1236, 
        lng:-101.68,
    });
    map.setZoom(12);
}

const resizeMap = function (){
    var heigth = window.innerHeight;

    var mapHeigth =  heigth  * .60;
    console.log("map heigth : " , mapHeigth)
    $('#mapa').css('height', mapHeigth);
}

const selection = function(id){
    $("#opcion"+id).addClass("active");
    $("#opcion"+idAnterior).removeClass("active");
    idAnterior = id;
    $.ajax({
        method: 'GET',
        url: HOST + '/city/' + $("#opcion"+id).attr("data-contenido"+id),
        type:'json',
        success: function(a){
            if(a.response.view.length > 0 ){
                if(a.response.view[0].result.length > 0 ){
                    moveMap( a.response.view[0].result[0].location.displayPosition.latitude,a.response.view[0].result[0].location.displayPosition.longitude);
                    $("#divResultados").html("");
                }
            }
        }
        });
}
