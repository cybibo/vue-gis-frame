 <template>
  <div id="map">
    <div id="popup">
      <div id="popupss" v-show="popupType==='warn'">
        <span>事发时间：</span><span>2019年3月9日</span>
        <p><span>事发地点：</span><span>松江区中山西路219号</span></p>
        <p><span>案情：</span><span>路口发生抢劫事件</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import 'ol/ol.css';
import Style from 'ol/style/style';
import Text from 'ol/style/text';
import Icon from 'ol/style/icon';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import proj from 'ol/proj';
import MTIMap from '~assets/js/gis/MTIMap';
import Circle from 'ol/style/circle';
import geomCircle from 'ol/geom/circle';
import Observable from 'ol/observable';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Overlay from 'ol/overlay';
import LayerManager from '~assets/js/gis/LayerManager';
import SHAMapLayer from '~assets/js/gis/SHAMapLayer';
import Map from 'ol/map';
import View from 'ol/view';
import LineString from 'ol/geom/linestring';
import MultiLineString from 'ol/geom/multilinestring';
import condition from 'ol/events/condition';
import Collection from 'ol/collection';
import mixin from './map';

import img_police from '../../../static/images/wuganyujing_yanwubaojingqi_icon.svg';
import img_jq1 from '../../../static/images/map_sharenshijian.png';
import img_jq2 from '../../../static/images/daoqianganjian.png';
import img_jq3 from '../../../static/images/map_juzhongnaoshi.png';
import img_jq4 from '../../../static/images/yishishijian.png';

import popover from './components/popover/index';
export default {
  mixins: [mixin],
  components: { popover },
  data() {
    return {
      popup: null,
      popupData: {},
      popupType: '',
      mapLayerList: [
        {
          name: '警力',
          id: '1',
          layerName: 'police'
        },
        {
          name: '视频监控',
          id: '3',
          layerName: 'video'
        },
        {
          name: '烟感',
          id: '4',
          layerName: 'SmokeSensation'
        },
        {
          name: '人脸',
          id: '5',
          layerName: 'face'
        }
      ]
    };
  },
  mounted() {
    if (process.env.NODE_ENV === 'production') {
      this.initIntranetMap(); //项目现场地图
    } else {
      this.initMap();
    }
    this.initLayer();
    this.initlevelLayer();
    this.testLoadPoint();
    this.bindMapClick();
  },
  methods: {
    // 初始化地图函数
    initMap() {
      // 初始化地图
      const params = {
        baseMapType: 'baidu-midnight',
        center: [121.440299, 31.180558],
        zoom: 15,
        mapContainer: 'map'
      };
      const myMap = new MTIMap(params);
      this.map = myMap.map;
      let controls = this.map.getControls().getArray();
      for (let i = 0; i < controls.length; i++) {
        this.map.removeControl(controls[i]);
      }
      //初始化图层管理工具
      this.layerManagerTool = new LayerManager({ map: this.map });
    },
    // 内网部署初始化化地图方法
    initIntranetMap() {
      this.map = new Map({
        target: 'map',
        view: new View({
          center: proj.fromLonLat([121.440299, 31.180558]),
          zoom: 15
        })
      });
      this.map.addLayer(SHAMapLayer.getNormalLayer()); //切片地图地图
      this.map.addLayer(SHAMapLayer.getMidnightAnnoLayer()); //深蓝版地图注记 测试
      let controls = this.map.getControls().getArray();
      for (let i = 0; i < controls.length; i++) {
        this.map.removeControl(controls[i]);
      }
      //初始化图层管理工具
      this.layerManagerTool = new LayerManager({ map: this.map });
    },

    initLayer() {
      // 散点图层
      // 把所有图片路径直接译成数组，数组内容顺序一一对应mapLayerList对象
      let imgList = [img_police];

      for (let i = 0; i < this.mapLayerList.length; i++) {
        let style = function(feature) {
          return new Style({
            image: new Icon({
              scale: 1, //图标缩放比例
              src: imgList[i] //图标的url
            })
          });
        };
        // 循环创建多个图层 this.mapLayerList[i].layerName为图层名称   by ltt 2018年11月8日
        let policePoint = this.layerManagerTool.createVectorLy(this.mapLayerList[i].layerName, style);
        this.layerManagerTool.addLayer(this.mapLayerList[i].layerName, policePoint);
      }
    },
    //初始化警情图层  点位根据不同的等级显示不同的图片
    initlevelLayer() {
      let style = function(feature) {
        var level = feature.get('level');
        var img = null,
          fontColor = null;
        if (level == '01') {
          img = img_jq1;
          fontColor = '#FF0000';
        } else if (level == '02') {
          img = img_jq2;
          fontColor = '#FF7403';
        } else if (level == '03') {
          img = img_jq3;
          fontColor = '#FFCD03';
        } else if (level == '04') {
          img = img_jq4;
          fontColor = '#006CFF';
        }
        return new Style({
          image: new Icon({
            scale: 0.3, //图标缩放比例
            src: img //图标的url
          }),
          text: new Text({
            offsetY: -50,
            textAlign: 'center', //位置
            textBaseline: 'middle', //基准线
            font: '300 14px 微软雅黑', //文字样式
            text: feature.get('name'), //文本内容
            fill: new Fill({ color: fontColor }) //文本填充样式（即文字颜色）
          })
        });
      };
      // 循环创建多个图层 this.mapLayerList[i].layerName为图层名称
      let policePoint = this.layerManagerTool.createVectorLy('warn', style);
      this.layerManagerTool.addLayer('warn', policePoint);

      this.mapLayerList.push({
        name: '警情',
        id: '2',
        layerName: 'warn'
      });
    },
    // 地图绑定图层的点击方法
    bindMapClick() {
      const container = document.getElementById('popup');
      this.popup = new Overlay({
        element: container,
        autoPan: true,
        positioning: 'bottom-center',
        stopEvent: false,
        autoPanAnimation: {
          duration: 250
        }
      });
      this.map.addOverlay(this.popup);
      this.map.on(
        'click',
        function(evt) {
          var feature = this.map.forEachFeatureAtPixel(
            evt.pixel,
            function(feature) {
              return feature;
            },
            { hitTolerance: 4 }
          );
          if (feature) {
            this.popupData = feature.values_.val;
            this.popupType = '';
            var type = feature.getProperties().type;
            //判断点击的点位类别显示不同弹出框
            if (type == 'warn') {
              this.popupType = 'warn';
            } else if (type == 'trafficLight') {
              this.videoPointPopupBool = false;
              this.trafficLightPopupBool = true;
              this.policemanPopupBool = false;
            } else if (type == 'policeman') {
              this.videoPointPopupBool = false;
              this.trafficLightPopupBool = false;
              this.policemanPopupBool = true;
              this.getEcharts();
            }
            this.popup.setPosition(feature.getGeometry().getCoordinates()); //设置popup的位置
          }
        },
        this
      );
    },
    boundaryStyleFunction(feature) {
      return new Style({
        stroke: new Stroke({
          color: '#3185FF',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(0,0,0,0.5)'
        })
      });
    },
    // 整个地图的加载事件散点图标
    readPointFeature(geom, id, name, val, type) {
      let feature = JSON.parse(geom);
      feature.properties = {
        id: id,
        name: name,
        val: val,
        type: type,
        level: val.jqjb
      };
      this.layerManagerTool.addFeature(this.layerManagerTool.readFeature(feature, '4326', '3857'), type);
    },
    // 清空某一图层
    clearFeature(featureType) {
      this.layerManagerTool.clearLayer(featureType);
    },
    //模拟数据写法  后期对接口时需修改
    setFeature(items, details) {
      if (items.checked) {
        if (items.type === 'police') {
          this.policeList.forEach(item => {
            this.readPointFeature(item.geom, item.id, item.name, item, items.type);
          });
          return;
        }
        if (items.type === 'warn') {
          this.warnList.forEach(item => {
            if (items.level === item.jqjb) {
              this.readPointFeature(item.geom, item.id, item.name, item, items.type);
            }
          });
          return;
        }
        if (items.type === 'monitor' || items.type === 'face' || items.type === 'bayonet' || items.type === 'fence' || items.type === 'elePolice') {
          this.monitorList.forEach(item => {
            if (items.type === item.type) {
              this.readPointFeature(item.geom, item.id, item.name, item, items.type);
            }
          });
          return;
        }
        if (
          items.type === 'rob' ||
          items.type === 'erotic' ||
          items.type === 'steal' ||
          items.type === 'fire' ||
          items.type === 'overseas' ||
          items.type === 'crowdGanther' ||
          items.type === 'fight'
        ) {
          this.ajlbList.forEach(item => {
            if (items.type === item.type) {
              this.readPointFeature(item.geom, item.id, item.name, item, item.type);
            }
          });
          return;
        }
      } else {
        this.clearFeature(items.type);
        if (items.type === 'warn') {
          details.forEach(val => {
            if (val.checked) {
              this.warnList.forEach(item => {
                if (val.level === item.jqjb) {
                  this.readPointFeature(item.geom, item.id, item.name, item, item.type);
                }
              });
            }
          });
        }
      }
    },
    testLoadPoint() {
      this.warnList.forEach(item => {
        this.readPointFeature(item.geom, item.id, item.name, item, item.type);
      });
    },
    //关闭地图点位信息弹出框
    colseInfoBox() {
      this.popupType = '';
      this.popupData = ' ';
    }
  }
};
</script>
<style>
#popupss {
  width: 400px;
  height: 300px;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  bottom: 70px;
  color: #fff;
  padding: 20px 10px;
}
</style>
