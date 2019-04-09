/**
 * company:上海道枢信息
 * Time:2018-6-25
 * author:yuanlk
 * 地图基础封装类
 */

import sourceVector from 'ol/source/vector';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Observable from 'ol/observable';
import Draw from 'ol/interaction/draw';
import Overlay from 'ol/overlay';
import FullScreen from 'ol/control/fullscreen';
import ZoomSlider from 'ol/control/zoomslider';
import OverviewMap from 'ol/control/overviewmap';
import ScaleLine from 'ol/control/scaleline';



var baseTools = function(options){
  this.init(options)
}
baseTools.prototype = {
  map: null,
  layer:null,
  layerTab:null,
  layerBool:true,
  layers:null,
  layersTab:null,
  layersBool:true,
  fullScreen:null,
  overviewmap:null,
  scaleline:null,
  draw:null,
  darwSource:null,
  sketch:null,
  pointermoveKey:null,
  zoomSlider:null,
  dragPan:null,
  MouseWheelZoom:null,
  msgStyleBool:true,
  /**
   * @desc:初始化
   */
  init: function (options) {
    var me = this;
    $.extend(this, options);
  },
  /**
   * 添加要切换的地图图层，并默认向地图添加第一个图层
   */
  addTabLayer: function (layer,layerTab) {
    var me = this;
    me.layer=layer;
    me.layerTab=layerTab;
    me.map.addLayer(me.layer);
  },
  /**
   * 切换图层
   */
  tabLayer:function(){
    var me=this;
    if(me.layerBool){
      me.map.removeLayer(me.layer);
      me.map.addLayer(me.layerTab);
      me.layerBool=false;
    }else{
      me.map.removeLayer(me.layerTab);
      me.map.addLayer(me.layer);
      me.layerBool=true;
    }
  },
  /**
   * 添加要切换的地图图层数组，并默认向地图添加第一个图层组
   * 参数为两个图层数据组
   */
  addTabLayers: function (layers,layersTab) {
    var me = this;
    me.layers=layers;
    me.layersTab=layersTab;
    me._addLayers(me.layers);
  },
  /**
   * 切换图层组
   */
  tabLayers:function(){
    var me=this;
    if(me.layersBool){
      me._removeLayers(me.layers);
      me._addLayers(me.layersTab);
      me.layersBool=false;
    }else{
      me._removeLayers(me.layersTab);
      me._addLayers(me.layers);
      me.layersBool=true;
    }
  },
  _addLayers:function(layers){
    var me=this;
    if(me.map){
      for(var i=0;i<layers.length;i++){
        me.map.addLayer(layers[i]);
      }
    }
  },
  _removeLayers:function(layers){
    var me=this;
    if(me.map){
      for(var i=0;i<layers.length;i++){
        me.map.removeLayer(layers[i]);
      }
    }
  },
  /**
   * 像地图添加全屏组件
   */
  addFullScreen:function(){
    var me=this;
    me.fullScreen=new FullScreen({
      tipLabel:"全屏切换"
    });
    me.map.addControl(me.fullScreen);
  },
  /**
   * 移除地图添加全屏组件
   */
  removeFullScreen:function(){
    var me=this;
    me.map.removeControl(me.fullScreen);
  },
  /**
   * 激活全屏（与vue element框架存在冲突）
   */
  activefullScreen:function(){
    var me=this;
    me.fullScreen.handleFullScreen_()
  },
  /**
   * 启用拉框缩放功能
   * 默认为拉框放大
   * @param:type==“MIN”是为拉框缩小
   */
  startBoxZoom:function(type){
    var me=this;
    if(me.msgStyleBool){
      me._addMsgStyle();
      me.msgStyleBool=false;
    }
    if(me.draw){
      me.map.removeInteraction(me.draw);
    }
    me.darwSource=new sourceVector();
    me.draw = new Draw({
      source: me.darwSource,
      type: "Circle",
      geometryFunction: Draw.createBox(),
      style:new Style({
        stroke: new Stroke({
          color: "rgb(0,0,255)",
          width: 4
        }),
        fill:new Fill({
          color: "rgba(255,255,255,0.4)",
        })
      })
    });
    me.map.addInteraction(me.draw);
    me.draw.on("drawstart",function(evt){
      me.sketch = evt.feature;
    });
    me.draw.on("drawend",function(evt){
      var feature = evt.feature;
      if(type=="MIN"){
        var zoonNum=me.map.getView().getZoom();
        var centerPoint=feature.getGeometry().getInteriorPoint();
        if(zoonNum>1){
          zoonNum=zoonNum-1;
        }
        me.map.getView().setZoom(zoonNum);
        me.map.getView().setCenter(centerPoint.getCoordinates());

      }else{
        me.map.getView().fit(feature.getGeometry());
      }
      me.sketch=null;
    })
    me._createHelpTooltip(); //创建帮助提示框
    if(me.pointermoveKey){
      Observable.unByKey(me.pointermoveKey);
    }
    me.pointermoveKey = me.map.on('pointermove', me._pointerMoveHandler, me);
  },
  /**
   * 移除拉框功能
   */
  endBoxZoom:function () {
    var me=this;
    me.darwSource=null;
    var me = this;
    Observable.unByKey(me.pointermoveKey);
    if (me.helpTooltipElement) {
      me.helpTooltipElement.parentNode.removeChild(me.helpTooltipElement);
    }
    me.helpTooltipElement=null;
    me.map.removeInteraction(me.draw);
  },
  /**
   * 禁止地图平移
   */
  disactivePan:function(){
    var me=this;
    me.dragPan= me.map.getInteractions().getArray()[2];//获取默认的平移交互控件
    me.dragPan.setActive(false);
  },
  /**
   * 启动地图平移
   */
  activePan:function(){
    var me=this;
    if(me.dragPan){
      me.dragPan.setActive(true);
    }
  },
  /**
   * 禁止地图滚轮缩放
   */
  disactiveZoom:function(){
    var me=this;
    me.MouseWheelZoom= me.map.getInteractions().getArray()[7];//获取默认的平移交互控件
    me.MouseWheelZoom.setActive(false);
  },
  /**
   * 启动地图滚轮缩放
   */
  activeZoom:function(){
    var me=this;
    if(me.MouseWheelZoom){
      me.MouseWheelZoom.setActive(true);
    }
  },
  /**
   * 添加鹰眼
   */
  addOverMap:function(target){
    var me=this;
    me.overviewmap= new OverviewMap({
      collapsible:false,
      target:target
    });//获取默认的平移交互控件
    me.map.addControl(me.overviewmap);
  },
  /**
   * 移除鹰眼
   */
  removeOverMap:function(){
    var me=this;
    if(me.overviewmap){
      me.map.removeControl(me.overviewmap);
    }
  },
  /**
   * 添加比例尺
   */
  addScaleLine:function(target){
    var me=this;
    me.scaleline= new ScaleLine({
      target:target
    });//获取默认的平移交互控件
    me.map.addControl(me.scaleline);
  },
  /**
   * 移除比例尺
   */
  removeScaleLine:function(){
    var me=this;
    if(me.scaleline){
      me.map.removeControl(me.scaleline);
    }
  },
  /**
   * 添加缩放控件
   */
  addZoomTools:function(){
    var me=this;
    me.zoomSlider=new ZoomSlider();
    me.map.addControl(me.zoomSlider);
  },
  /**
   * 移除缩放控件
   */
  removeZoomTools:function(){
    var me=this;
    me.map.removeControl(me.zoomSlider);
  },
  /**
   * 根据extent缩放到全图
   */
  fullMap:function(extent){
    this.map.getView().fit(extent);
  },
  _createHelpTooltip: function () {
    var me = this;
    if (me.helpTooltipElement) {
      me.helpTooltipElement.parentNode.removeChild(me.helpTooltipElement);
    }
    me.helpTooltipElement = document.createElement('div');
    me.helpTooltipElement.className = 'drawBoxTooltip hidden';
    me.helpTooltip = new Overlay({
      element: me.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    me.map.addOverlay(me.helpTooltip);
  },
  _pointerMoveHandler: function (evt) {
    var me = this;
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    var helpMsg = '单击开始拉框';//当前默认提示信息
    if (me.sketch) {
      helpMsg = "再次单击结束拉框"; //绘制提示相应内容
    }
    me.helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
    me.helpTooltip.setPosition(evt.coordinate);//设置帮助提示框的位置
  },
  _loadStyleString: function (css) {
    var style = document.createElement("style");
    style.type = "text/css";
    try {
      style.appendChild(document.createTextNode(css));
    } catch (ex) {
      style.styleSheet.cssText = css;
    }
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  },
  _addMsgStyle:function(){
    this._loadStyleString(
      "      .drawBoxTooltip {" +
      "            position : relative;" +
      "            background: rgba(0, 0, 0, 0.9);" +
      "            border-radius: 4px;" +
      "            color: white;" +
      "            padding: 4px 8px;" +
      "            opacity: 0.7;" +
      "            white-space: nowrap;}" )
  }
}

export default baseTools;
