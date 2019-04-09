/**
 * company:上海道枢信息
 * Time:2018-7-10
 * author:yuanlk
 * 地图指派业务封装 如派警业务
 */
import sourceVector from 'ol/source/vector';
import layerVector from 'ol/layer/vector';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Stroke from 'ol/style/stroke';
import LineString from 'ol/geom/linestring';
import Style from 'ol/style/style';
import Select from 'ol/interaction/select';
import Modify from 'ol/interaction/Modify';
import Icon from 'ol/style/icon';
import Observable from 'ol/observable';

var sendPoint = function(options){
  this.init(options)
};
sendPoint.prototype = {
    map: null,//地图对象，必填参数
    toLayer: null,//指派位置图层，必填参数
    fromLayer: null,//被指派位置图层，必填参数
    select: null,
    arrowLayer: null,
    arrowSource: null,
    modify: null,
    modifyEventKey:null,
    arrowImgScale:0.12,
    arrowImgPath: null,//箭头符号路径，可选参数
    selectStyle: null,//选择后点位的样式，可选参数
    saveCoordinates:null,//保存点位回归的坐标
    selectFeature:null,
    init: function (options) {
        Object.assign(this, options);
        if (this.arrowImgPath) {
            this._newArrowLayer();
        }
    },
    _newArrowLayer: function () {
        var me = this;
        this.arrowSource = new  sourceVector();
        this.arrowLayer = new layerVector({
            source: this.arrowSource,
            style: function (feature) {
                var geometry = feature.getGeometry();
                var styles = [
                    new Style({
                        stroke: new Stroke({
                            color: "#ff0000",
                            width: 4,
                            lineDash: [5, 5]
                        })
                    })
                ];
                if (geometry.getType() == "LineString") {
                    var length = geometry.getCoordinates().length;
                    var dx = geometry.getCoordinates()[length - 1][0] - geometry.getCoordinates()[length - 2][0];
                    var dy = geometry.getCoordinates()[length - 1][1] - geometry.getCoordinates()[length - 2][1];
                    var rotation = Math.atan2(dy, dx);
                    var coords = [geometry.getCoordinates()[length - 1][0], geometry.getCoordinates()[length - 1][1]];
                    styles.push(new Style({
                        geometry: new Point(coords),
                        image: new Icon({
                            src: me.arrowImgPath,
                            scale: me.arrowImgScale,
                            anchor: [0.75, 0.5],
                            rotateWithView: true,
                            rotation: -rotation
                        })
                    }));
                }
                return styles;
            }
        });
        this.map.addLayer(this.arrowLayer);
    },
    /**
     *
     * @param featureAttr  被指派位置的属性
     * @param attrValue    被指派位置的属性值
     * @param f 指派完成的处理函数function(fromFeature,toFeature)
     * fromFeature 指派的位置  如派警业务中的“警员”
     * toFeature 被指派的位置  如派警业务中的“警情”
     */
    startSendPoint: function (featureAttr, attrValue, f) {
        var me = this;
        this.select = new Select({
            style: this.selectStyle,
            layers: [this.fromLayer],
            hitTolerance:10
        });
        this.modify = new Modify({
            pixelTolerance:20,
            features: this.select.getFeatures(),
            style: this.selectStyle
        });
        this.map.addInteraction(this.select);
        this.map.addInteraction(this.modify);
        this.select.on("select", function (evt) {
            var lineCoords = [];
            //当初次选中元素时绑定移动结束事件
            if (evt.deselected.length == 0 && evt.selected.length > 0) {
                me.selectFeature = evt.selected[0];
                me.saveCoordinates = me.selectFeature.getGeometry().getCoordinates();
                me.modifyEventKey=me.modify.on("modifyend", function (evt) {
                    var toFeature = me.map.forEachFeatureAtPixel(evt.mapBrowserEvent.pixel, function (feature, layer) {
                            if (layer === me.toLayer) {
                                if (feature.getGeometry().getType() == 'Point') {
                                    return feature;
                                } else {
                                    return null;
                                }
                            }
                        }, {hitTolerance: 6}
                    );
                    if (toFeature) {
                        if (toFeature.getProperties()[featureAttr] == attrValue) {
                            // 外部传入处理函数
                            if (f) {
                                f(me.selectFeature, toFeature);
                            }
                            if (me.arrowImgPath) {
                                lineCoords.push(me.saveCoordinates);
                                lineCoords.push(toFeature.getGeometry().getCoordinates());
                                var lineFeature = new Feature({
                                    geometry: new LineString(lineCoords)
                                })
                                me.arrowSource.addFeature(lineFeature);//添加箭头线
                            }
                          me.endSendPoint();
                        }
                    }
                })
            }
            //当更换选择时的触发
          if (evt.deselected.length>0 && evt.selected.length > 0) {
            var deselectedFeature = evt.deselected[0];
            deselectedFeature.setGeometry(new Point(me.saveCoordinates));
            me.selectFeature = evt.selected[0];
            me.saveCoordinates = me.selectFeature.getGeometry().getCoordinates();
            if(me.modifyEventKey){
              Observable.unByKey(me.modifyEventKey)
            }
            me.modifyEventKey=me.modify.on("modifyend", function (evt) {
              var toFeature = me.map.forEachFeatureAtPixel(evt.mapBrowserEvent.pixel, function (feature, layer) {
                  if (layer === me.toLayer) {
                    if (feature.getGeometry().getType() == 'Point') {
                      return feature;
                    } else {
                      return null;
                    }
                  }
                }, {hitTolerance: 6}
              );
              if (toFeature) {
                if (toFeature.getProperties()[featureAttr] == attrValue) {
                  // 外部传入处理函数
                  if (f) {
                    f(me.selectFeature, toFeature);
                  }
                  if (me.arrowImgPath) {
                    lineCoords.push(me.saveCoordinates);
                    lineCoords.push(toFeature.getGeometry().getCoordinates());
                    var lineFeature = new Feature({
                      geometry: new LineString(lineCoords)
                    })
                    me.arrowSource.addFeature(lineFeature);//添加箭头线
                  }
                  me.endSendPoint();
                }
              }
            })

          }
            //当之前选中元素，后续单击选中元素时,解除鼠标地图移动事件绑定并回归点位
            if (evt.deselected.length > 0 && evt.selected.length == 0) {
                var deselectedFeature = evt.deselected[0];
                deselectedFeature.setGeometry(new Point(me.saveCoordinates));
            }
        })
    },
    /**
     * 结束指派函数
     */
    endSendPoint: function () {
        if (this.select) {
            var point = new Point(this.saveCoordinates);
            this.selectFeature.setGeometry(point);//点位回归
            this.map.removeInteraction(this.select);
            this.map.removeInteraction(this.modify);
            this.select=null;
            this.modify=null;
        }
    },
  clearArrow: function () {
    if (this.arrowImgPath) {
      this.arrowSource.clear();
    }
  }
}

export default sendPoint;
