/**
 * company:上海道枢信息
 * Time:2018-6-29
 * author:yuanlk
 * 地理围栏封装类
 */

import 'ol/ol.css';
import LayerManager from "./LayerManager";
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Circle from 'ol/style/circle';
import geomCircle from 'ol/geom/circle';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Polygon from 'ol/geom/polygon';
import proj from 'ol/proj';
import LineString from 'ol/geom/linestring';
import {buffer as TurfBuffer,point as  TurfPoint,nearestPointOnLine as TurfNearestPointOnLine,lineString as TurfLineString,booleanPointInPolygon as TurfBooleanPointInPolygon,polygon as TurfPolygon } from "@turf/turf/turf";


var GeographicFence = function(options){
  this.init(options);
};
GeographicFence.prototype = {
  map: null,//地图对象
  pointFenceLength:null,
  lineFenceLength:null,
  pointCoords:null,
  lineFence:null,
  linePolygonFence:null,
  polygonCoords:null,
  layerManagerTool:null,
  /**
   * 工具初始化函数
   */
  init: function (options) {
    var me = this;
    Object.assign(this,options);
    this.layerManagerTool=new LayerManager({map:this.map});
    var fenceLayer = this.layerManagerTool.createVectorLy("fenceLayer", this.fenceStyle);
    this.layerManagerTool.addLayer("fenceLayer", fenceLayer);//显示图形图层
    },
  /**
   * 设置点地理围栏坐标及半径
   */
  setPointFence(ptCoords,length){
    var pointBufferLayer = this.layerManagerTool.createVectorLy("pointBufferLayer", this.fenceDistanceStyle);
    this.layerManagerTool.addLayer("pointBufferLayer", pointBufferLayer);
    this.pointCoords=ptCoords;
    this.pointFenceLength=length;
    var pointFeature=new Feature({
        geometry:new Point(proj.fromLonLat(ptCoords))
      }
    );
    this.layerManagerTool.addFeature(pointFeature, "fenceLayer");
  },
  /**
   * 设置线地理围栏坐标及半径
   */
  setLineFence(lineCoords,length){
    var lineBufferLayer = this.layerManagerTool.createVectorLy("lineBufferLayer", this.fenceDistanceStyle);
    this.layerManagerTool.addLayer("lineBufferLayer", lineBufferLayer);
    this.lineFence = TurfLineString(lineCoords);
    this.lineFenceLength =length;
    var projLineCoords=[]
    for(var i=0;i<lineCoords.length;i++){
      projLineCoords.push(proj.fromLonLat(lineCoords[i]))
    }
    var LineFeature=new Feature({
      geometry:new LineString(projLineCoords)
    });
    this.layerManagerTool.addFeature(LineFeature, "fenceLayer");
  },
  /**
   * 设置面地理围栏坐标
   */
  setPolygonFence(polygonCoords){
    this.polygonCoords=polygonCoords;
    var polygonBufferLayer = this.layerManagerTool.createVectorLy("polygonBufferLayer", this.fenceDistanceStyle);
    this.layerManagerTool.addLayer("polygonBufferLayer", polygonBufferLayer);
    this.linePolygonFence = TurfLineString(polygonCoords.slice(0,polygonCoords.length-2));
    var projPolygonCoords=[];
    for(var i=0;i<polygonCoords.length;i++){
      projPolygonCoords.push(proj.fromLonLat(polygonCoords[i]))
    }
    var polygonFeature=new Feature({
      geometry:new Polygon([projPolygonCoords])
    });
    this.layerManagerTool.addFeature(polygonFeature, "fenceLayer");

  },
  /**
   * 设置线地理围栏触发函数，f为回调函数参数为length，当前距离，单位km
   */
  alarmLineBufferFence(coordinate,f,f1){
    this.layerManagerTool.clearLayer("lineBufferLayer");
    var pt = TurfPoint(coordinate);
    var snapped = TurfNearestPointOnLine(this.lineFence, pt, {units: 'kilometers'});
    var line=new LineString([proj.fromLonLat(snapped.geometry.coordinates),proj.fromLonLat(coordinate)]);
    var length=Math.round(line.getLength() /1000* 100) / 100;
    if(length<this.lineFenceLength){
      if(f){
        f(length)
      }
      var buffered = TurfBuffer(this.lineFence, length, {units: 'kilometers'});
      this.layerManagerTool.addFeature(this.layerManagerTool.readFeature(buffered, "4326", "3857"), "lineBufferLayer");
      var linefeature=new Feature({
        geometry: line,
        distance:length+"km"
      });
      this.layerManagerTool.addFeature(linefeature, "lineBufferLayer");
    }else{
      if(f1){
        f1();
      }
    }
  },
  /**
   * 设置点地理围栏触发函数，f为回调函数参数为length，当前距离，单位km
   */
  alarmPointBufferFence(coordinate,f,f1){
    this.layerManagerTool.clearLayer("pointBufferLayer");
    var line=new LineString([proj.fromLonLat(this.pointCoords),proj.fromLonLat(coordinate)]);
    var length=Math.round(line.getLength() /1000* 100) / 100;
    if(length<this.pointFenceLength){
      if(f){
        f(length)
      }
      var linefeature=new Feature({
        geometry: line,
        distance:length+"km"
      });
      var circlefeature=new Feature({
        geometry: new geomCircle(proj.fromLonLat(this.pointCoords), line.getLength()),
      });
      this.layerManagerTool.addFeature(linefeature, "pointBufferLayer");
      this.layerManagerTool.addFeature(circlefeature, "pointBufferLayer");
    }else{
      if(f1){
        f1()
      }
    }
  },
  /**
   * 设置面地理围栏触发函数，f为回调函数参数为length，当前距离单位km
   */
  alarmPolygonBufferFence(coordinate,f,f1){
    this.layerManagerTool.clearLayer("polygonBufferLayer");
    var pt = TurfPoint(coordinate);
    var poly = TurfPolygon([this.polygonCoords]);
    var booleanPointInPolygon=TurfBooleanPointInPolygon(pt,poly);
    var snapped = TurfNearestPointOnLine(this.linePolygonFence, pt, {units: 'kilometers'});
    var line=new LineString([proj.fromLonLat(snapped.geometry.coordinates),proj.fromLonLat(coordinate)]);
    var length=Math.round(line.getLength() /1000* 100) / 100;
    if(booleanPointInPolygon){
      if(f){
        f(length)
      }
      var linefeature=new Feature({
        geometry: line,
        distance:length+"km"
      });
      this.layerManagerTool.addFeature(linefeature, "polygonBufferLayer");
    }else{
      if(f1){
        f1()
      }
    }
  },
  fenceDistanceStyle(feature){
    var geometryType=feature.getGeometry().getType();
    if(geometryType=="Point"){
      return new Style({
        image:new Circle({
          radius: 7,
          fill: new Fill({
            color: "#ff0000"
          })
        })
      });
    }else if(geometryType=="LineString"){
      return new Style({
        stroke: new Stroke({
          color: "rgb(255,0,0)",
          width: 2
        }),
        text: new Text({
          textAlign: 'center', //位置
          textBaseline: 'middle', //基准线
          font: 'bold 14px 微软雅黑',  //文字样式
          text: feature.get('distance'),  //文本内容
          fill: new Fill({color: '#000000'}), //文本填充样式（即文字颜色）
          stroke: new Stroke({color: '#ff0000', width: 1}),
          overflow: true,
          placement: "line",
        })
      })
    }else{
      return new Style({
        stroke: new Stroke({
          color: "rgb(255,0,0)",
          width: 1,
          lineDash:[10,10]
        }),
        fill: new Fill({
          color: 'rgba(0,0,0,0.1)'
        })
      })
    }
  },
  fenceStyle(feature){
    return new Style({
      image:new Circle({
        radius: 7,
        fill: new Fill({
          color: "#00ff00"
        })
      }),
      stroke:new Stroke({
        color: "rgb(0,255,0)",
        width: 4
      }),
      fill: new Fill({
        color: 'rgba(0,0,0,0.1)'
      })
    });
  }
}

export default GeographicFence;












