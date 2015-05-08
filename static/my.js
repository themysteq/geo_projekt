/**
 * Created by mysteq on 2015-05-08.
 */

var geo_diff = 1000;
//var long_min = 2106604;
//var lat_min  = 7116593;
function get_fresh_map(_long_min, _lat_min){

    //alert('get fresh map');
    $.get("/get_map",{ long_min: _long_min, lat_min:_lat_min},function( data )
        {
            var mysrc = 'data:image/jpeg;base64,' + data;
           // console.log($("#mapimg"));
            $("#mapimg").attr("src", mysrc);
        }
    ).always(
        function () {
            //alert("load done");
        }
    );


}

function click_left(){
    $('#long_min').val( parseInt($('#long_min').val())-geo_diff);
    get_fresh_map($('#long_min').val(),$('#lat_min').val());
    console.log($('#long_min').val());
}

function click_right(){
    $('#long_min').val(parseInt($('#long_min').val())+geo_diff);
    get_fresh_map($('#long_min').val(),$('#lat_min').val());
    console.log($('#long_min').val());
}

function click_up(){
    //var lat_min = $('#lat_min').value;
    $('#lat_min').val(parseInt($('#lat_min').val())+geo_diff);
    get_fresh_map($('#long_min').val(),$('#lat_min').val());
    console.log($('#lat_min').val());
}

function click_down(){
    $('#lat_min').val(parseInt($('#lat_min').val())-geo_diff);
    get_fresh_map($('#long_min').val(),$('#lat_min').val());
    console.log($('#lat_min').val());
}