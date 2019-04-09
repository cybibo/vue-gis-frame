/**
 * company:上海道枢信息
 * Time:2018-11-5
 * author:yuanlk
 * 徐汇分局合成指挥项目-高德内网地图封装
 */
import proj from 'ol/proj';
import Tile from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import TileGrid from 'ol/tilegrid/tilegrid';
import extent from 'ol/extent';
import TileImage from 'ol/source/tileimage';

let SHAMapLayer = {
  //高德内网常规风格地图
  getNormalLayer(){    
    let normalLayer = new Tile({
        source: new XYZ({
            //crossOrigin:'anonymous',//打印地图时不设置导致无法输出
            url: 'http://15.75.0.255:25333/v3/tile?x={x}&y={y}&z={z}'
        })
    });
    return normalLayer;
   },
   //高德地图内网深蓝风格地图地图
   getMidnightLayer(){
    let midnightLayer = new Tile({
        source: new XYZ({
            url: 'http://15.75.0.255:25003/v3/tile?x={x}&y={y}&z={z}'
        })
    });
    return midnightLayer;
   },
   //高德地图内网深蓝风格地图注记
   getMidnightAnnoLayer(){
    let midnightAnnoLayer = new Tile({
        source: new XYZ({
            url: 'http://15.75.0.255:25888/v3/tile?x={x}&y={y}&z={z}'
        })
    });
    return midnightAnnoLayer;
   },
   //高德地图内网实时路况
   getTrafficLayer(){
    let timeKey = new Date().getTime();
    let trafficLayer = new Tile({
        source: new XYZ({
            url: 'http://15.75.0.255:8883/tile?lid=traffic&get=map&cache=off&x={x}&y={y}&z={z}&_dc='+timeKey
        })
    });
    return trafficLayer;
   },
}
export default SHAMapLayer;
