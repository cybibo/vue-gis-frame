/**
 * company:上海道枢信息
 * Time:2018-6-26
 * author:yuanlk
 * 动画自动绘制线
 */

import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import LineString from 'ol/geom/linestring';
import Style from 'ol/style/style';
import sourceVector from 'ol/source/vector';
import layerVector from 'ol/layer/vector';
import Stroke from 'ol/style/stroke';
import Icon from 'ol/style/icon';
import Observable from 'ol/observable';

var AnimationLine =function(options){
  this.init(options)

};
AnimationLine.prototype = {
  map: null,
  animating: false,//是否处于动画状态
  now: null,//动画开始时间
  sourceIndexArray: null,
  imgPath: null,//移动图标路径
  imgScale: 0.5,
  lineWidth: 2,
  lineColor: '#ff0000',
  coords: [], //传入的线路坐标
  routeCoords: [],//细化后的坐标
  postcomposeEvt: null,//实时渲染事件
  lineLayer: null,
  sourceIndexEvt: 1,//记录动画原始坐标索引
  sourceIndexBool: true,
  lineSource: null,
  speed: 1,//运行速度
  extentShow: [],
  init: function (options) {
    var me = this;
    Object.assign(this, options);
    this.lineSource = new sourceVector();
    this.lineLayer = new layerVector({
      source: me.lineSource,
      style: function (feature) {
        var geometry = feature.getGeometry();
        var styles = [
          new Style({
            stroke: new Stroke({
              color: me.lineColor,
              width: me.lineWidth
            })
          })
        ];
        if (geometry.getType() == "LineString") {
          var length = geometry.getCoordinates().length;
          var dx = geometry.getCoordinates()[length - 1][0] - geometry.getCoordinates()[length - 2][0];
          var dy = geometry.getCoordinates()[length - 1][1] - geometry.getCoordinates()[length - 2][1];
          me.rotation = Math.atan2(dy, dx);
          var coords = [geometry.getCoordinates()[length - 1][0], geometry.getCoordinates()[length - 1][1]];
          styles.push(new Style({
            geometry: new Point(coords),
            image: new Icon({
              src: me.imgPath,
              scale: me.imgScale,
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -me.rotation
            })
          }));
        }
        return styles;
      }
    });
    me.map.addLayer(this.lineLayer)
  },
  /**
   * 开始绘制动画，传入投影后的X，Y坐标数组
   * @param coords
   */
  startAnimation: function (coords) {
    var me = this;
    me.stopAnimation();
    me.sourceIndexEvt = 1;
    me.sourceIndexBool = true;
    this.lineSource.clear();
    me.coords = coords;
    me.getRouteCoords(me.coords);
    me.map.getView().fit(me.extentShow);
    me.now = new Date().getTime();
    me.postcomposeEvt = me.map.on('postcompose', me.moveFeature, me);
    me.animating=true;
    me.map.render();
  },
  /**
   *清除动画图层
   */
  clear:function () {
    this.stopAnimation();
    this.lineSource.clear();
  },
  /**
   * 停止动画
   */
  stopAnimation: function () {
    var me = this;
    if(me.animating){
      me.animating=false;
      Observable.unByKey(me.postcomposeEvt);
    }
  },
  /**
   * 重启动画，如何动画执行完毕则重启动画,
   * 不建议使用
   */
  restartAnimation: function () {
    var me=this;
    if(!me.animating){
      if(me.index >= me.routeCoords.length){
        if(me.coords){
          me.startAnimation(me.coords);
          return
        }
      }
      me.map.getView().fit(me.extentShow);
      me.postcomposeEvt = me.map.on('postcompose', me.moveFeature, me);
      me.map.render();
      me.animating=true;
    }
  },
  //移动要素
  moveFeature: function (event) {
    var me = this;
    var frameState = event.frameState;
    var elapsedTime = frameState.time - me.now;
    var index = Math.round(me.speed * elapsedTime / 1000);
    if (index >= me.routeCoords.length) {
      me.stopAnimation();
      var currentLine = new LineString(me.coords);
      var feature = new Feature(currentLine);
      this.lineSource.clear();
      this.lineSource.addFeature(feature);
      return;
    }
    var preCoords = [];
    var lastCoords = null;
    var lineCoords = null;
    if (index < me.sourceIndexArray[me.sourceIndexEvt] && me.sourceIndexBool) {
      lineCoords = me.routeCoords.slice(0, index)
    } else {
      me.sourceIndexBool = false;
      if (me.sourceIndexArray[me.sourceIndexEvt] < index) {
        me.sourceIndexEvt++;
      }
      lastCoords = me.routeCoords.slice(me.sourceIndexArray[me.sourceIndexEvt - 1], index);//截取动画段坐标
      preCoords = me.coords.slice(0, me.sourceIndexEvt);//截取原始段坐标
      lineCoords = preCoords.concat(lastCoords);//连接线坐标
    }
    var currentLine = new LineString(lineCoords);
    var feature = new Feature(currentLine);
    this.lineSource.clear();
    this.lineSource.addFeature(feature);
    me.map.render();
  },
  //获取精细化坐标点
  getRouteCoords: function (coords) {
    var me = this;
    var sourceIndex = 0;
    me.sourceIndexArray = [];//记录原线坐标的在细化坐标中的索引
    var start;
    var end;
    if (coords.length < 2) {
      return;
    }
    var routeCoords = [];
    var minx = coords[0][0];
    var miny = coords[0][1];
    var maxx = coords[0][0];
    var maxy = coords[0][1];
    for (var t = 0; t < coords.length; t++) {
      start = coords[t];
      end = coords[t + 1];
      var xdiff = end[0] - start[0];
      var ydiff = end[1] - start[1];
      var c = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
      var count = Math.round(c);
      var startx = start[0];
      var starty = start[1];
      var avg_x = xdiff / count;
      var avg_y = ydiff / count;
      routeCoords.push(start);
      me.sourceIndexArray.push(sourceIndex);
      for (var i = 0; i < count; i++) {
        sourceIndex++;
        startx += avg_x;
        starty += avg_y;
        var val = [startx, starty];
        routeCoords.push(val);
      }
      if (minx > end[0]) {
        minx = end[0];
      }
      else if (maxx < end[0]) {
        maxx = end[0]
      }
      if (miny > end[1]) {
        miny = end[1];
      }
      else if (maxy < end[1]) {
        maxy = end[1];
      }
      if (t + 2 === coords.length) {
        routeCoords.push(end);
        me.routeCoords = routeCoords;
        me.extentShow = [];
        me.extentShow.push(minx);
        me.extentShow.push(miny);
        me.extentShow.push(maxx);
        me.extentShow.push(maxy);
        return;
      }
    }
  }
}

export default AnimationLine;
