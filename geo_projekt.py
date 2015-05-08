from flask import Flask, request, jsonify, Response,render_template
import json
import base64
import requests
import logging
app = Flask(__name__)

logging.basicConfig()
logger = logging.getLogger("wms_app")
logger.setLevel(logging.DEBUG)
"""
http://mapy.geoportal.gov.pl/gpsr-web/gpsr/katalogWMS/Geoportal?f=json
"""

server_orto = "http://mapy.geoportal.gov.pl/wss/service/img/guest/ORTO/MapServer/WMSServer"
server_hydro = "http://mapy.geoportal.gov.pl/wss/service/img/guest/HYDRO/MapServer/WMSServer"

#WGS84
#proj = "EPSG:4326"
#long_min = 18.749418
#lat_min = 53.577950


proj = "EPSG:3857"
long_min = 2106604
lat_min  = 7116593
#geo_diff = 0.2
geo_diff = 10000
tile_width = 512
tile_height = 512

wms_headers = {"X-Milo-ze-patrzysz-w-logi": "Projekt studencki/Politechnika Gdanska/WETI",
               "User-Agent": "Python/WMS_explorer_0.1",
               "X-Student": "137328",}

long_max = long_min+geo_diff
lat_max = lat_min+geo_diff


def prepare_params(_lat_min, _long_min, _geo_diff):
    #orto_data = requests.get("")

   # logger.debug("PARARARAR "+str((_lat_min,_long_min)))
    _long_max = _long_min + _geo_diff
    _lat_max = _lat_min + _geo_diff

    bbox_string = str.join(',', (str(_long_min), str(_lat_min), str(_long_max), str(_lat_max)))
    logger.debug("BBOX STRING "+ bbox_string)
    #bbox_string = ','.join((long_min, lat_min, long_max, lat_max))
    wms_params = dict({"FORMAT": "image/jpeg", "VERSION": "1.1.1", "SERVICE": "WMS", "REQUEST": "GetMap",
                   "LAYERS": "Raster", "STYLES": "", "SRS": proj, "WIDTH": tile_width, "HEIGHT": tile_height,
                   "BBOX": bbox_string})
    #logger.debug(wms_params)
    return wms_params


def get_map_image_in_b64(map_url, wms_params):

    response = dict()
    map_response = requests.get(url=server_orto, params=wms_params, headers=wms_headers)
    response_content_type = str(map_response.headers['content-type']).split('/')
    debug = dict()
    debug['wms'] = wms_params
    debug['computed'] = {}
    logger.info(map_response.url)
    if response_content_type[0] == "image":
        logger.info("dobrze, to obrazek formatu {0}".format(response_content_type[1]))
        map_image_encoded = base64.b64encode(map_response.content)
        #logger.debug(map_image_encoded)
        response['debug'] = debug
       # return Response(map_image_encoded, mimetype='/'.join(response_content_type))
        response['map_b64'] = map_image_encoded
        return response
    else:
        logger.error("masz jakis blad, przyszlo {0}".format('/'.join(response_content_type)))
        return None


@app.route('/get_map')
def get_map():
    if request.method == "GET":
        _long_min = request.args.get('long_min', None)
        _lat_min = request.args.get('lat_min', None)
        _geo_diff = request.args.get('geo_diff', geo_diff)
       # logger.debug(str((_long_min, _lat_min)))
        if _long_min is None or _lat_min is None:
            #no sory, obydwa musza byc dobre
            return Response(status=400)
        else:
            _wms_params = prepare_params(float(_lat_min), float(_long_min), float(_geo_diff))
           # logger.debug("GET MAP BY JS"+str(_wms_params))
            response = get_map_image_in_b64(server_orto, _wms_params)
            return Response(response['map_b64'], mimetype='image/jpeg',)


@app.route('/json')
def json_index():
    result = dict()
    result['status'] = "OK"
    result['schema'] = {"width": "int", "height": "int"}
    return jsonify(**result)

@app.route('/info/hydro')
def show_info_hydro():
    return "hydromapa"


@app.route('/info/orto')
def show_info_orto():
    return "ortofotomapa"


@app.route('/info')
def show_info():
    pass
    """
    username = request.args.get('username')
    password = request.args.get('password')
    """
    # 18.749418,53.577950,19.324140,53.921847"
    return "wms_headers: "+str(wms_headers)



@app.route('/showmap')
def show_map():

    _wms_params = prepare_params(lat_min, long_min, geo_diff)
    #get_map_image_in_b64(ser, wms_params)
    response = get_map_image_in_b64(server_orto, _wms_params)
    if response is not None:
        return render_template("showmap.html", map_base64=response['map_b64'], title="Mapa", debug=response['debug'])
    else:
        return Response("BAD REQUEST", status=400)



@app.route('/')
def hello_world():
    return 'Hello World!'

import sys
print sys.version
if __name__ == '__main__':
    app.run()
