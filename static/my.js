/**
 * Created by mysteq on 2015-05-08.
 */
var zoom_step = 1000;
//var geo_diff = 1000;
//var long_min = 2106604;
//var lat_min  = 7116593;
function get_fresh_map(_long_min, _lat_min,_geo_diff){

    //alert('get fresh map');
    $.get("/get_map",{ long_min: _long_min, lat_min:_lat_min,geo_diff: _geo_diff},function( data )
        {
            var mysrc = 'static/map.jpg?' + new Date().getTime();
            console.log($("#mapimg"));
            $("#mapimg").attr("src", mysrc);
        }
    ).always(
        function () {
            //alert("load done");
        }
    );

}

function get_fresh_map_topo(_long_min, _lat_min,_long_max,_lat_max){

    alert('get fresh top');
    $.get("/get_map/topo",{ long_min: _long_min, lat_min:_lat_min, long_max:_long_max, lat_max: _lat_max}, function( data )
        {
           // var mysrc = 'static/map.jpg?' + new Date().getTime();
           // console.log($("#mapimg"));
           // $("#mapimg").attr("src", mysrc);
        }
    ).always(
        function () {
            //alert("load done");
        }
    );

}

function click_left(){
    var geo_diff = parseInt($('#geo_diff').val()/10);
    $('#long_min').val( parseInt($('#long_min').val())-geo_diff);
    get_fresh_map($('#long_min').val(),$('#lat_min').val(),$('#geo_diff').val());
    console.log($('#long_min').val());
}

function click_right(){
    var geo_diff = parseInt($('#geo_diff').val()/10);
    $('#long_min').val(parseInt($('#long_min').val())+geo_diff);
    get_fresh_map($('#long_min').val(),$('#lat_min').val(),$('#geo_diff').val());
    console.log($('#long_min').val());
}

function click_up(){
    var geo_diff = parseInt($('#geo_diff').val()/10);
    $('#lat_min').val(parseInt($('#lat_min').val())+geo_diff);
    get_fresh_map($('#long_min').val(),$('#lat_min').val(),$('#geo_diff').val());
    console.log($('#lat_min').val());
}

function click_down(){
    var geo_diff = parseInt($('#geo_diff').val()/10);
    $('#lat_min').val(parseInt($('#lat_min').val())-geo_diff);
    get_fresh_map($('#long_min').val(),$('#lat_min').val(),$('#geo_diff').val());
    console.log($('#lat_min').val());
}
function click_zoom_in(){
    //alert('zoom in!');
    var geo_diff = parseInt($('#geo_diff').val());
    var new_geo_diff = (geo_diff - zoom_step );
    $('#geo_diff').val(parseInt(new_geo_diff));


    $('#lat_min').val(parseInt($('#lat_min').val())+zoom_step/2);
    $('#long_min').val(parseInt($('#long_min').val())+zoom_step/2);

    get_fresh_map($('#long_min').val(),$('#lat_min').val(),$('#geo_diff').val());
}
function click_zoom_out(){
    var geo_diff = parseInt($('#geo_diff').val());
    var new_geo_diff = (geo_diff + zoom_step );
    $('#geo_diff').val(parseInt(new_geo_diff));

    $('#lat_min').val(parseInt($('#lat_min').val())-zoom_step/2);
    $('#long_min').val(parseInt($('#long_min').val())-zoom_step/2);

    get_fresh_map($('#long_min').val(),$('#lat_min').val(),$('#geo_diff').val());
}
function get_click_topo(){
    var geo_diff = parseInt($('#geo_diff').val());

    get_fresh_map_topo($('#long_min').val(),$('#lat_min').val(),parseInt($('#long_min').val())+geo_diff,parseInt($('#lat_min').val())+geo_diff);
}