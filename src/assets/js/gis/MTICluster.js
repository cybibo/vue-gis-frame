/**
 * company:上海道枢信息
 * Time:2018-7-12
 * author:yuanlk
 * 地图点位动画聚合
 */
import AnimatedCluster from 'ol-ext/layer/AnimatedCluster';
import SelectCluster from './MTISelectCluster';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Icon from 'ol/style/icon';
import Cluster from 'ol/source/cluster';
import Text from 'ol/style/text';

var MTICluster = function(options){
  this.init(options);
};
MTICluster.prototype = {
  map: null,
  source:null,
  clusterSource: null,
  clusterLayer: null,
  iconUrl: null,
  selectCluster: null,
  maxSelect:10,
  styleCache:{},
  openClusterstyle: new Style(//点击聚簇点弹出的图层样式
    {
      image: new Circle(
        {
          stroke: new Stroke({color: "rgba(0,0,192,0.6)", width: 5}),
          fill: new Fill({color: "rgba(0,0,192,1)"}),
          radius: 5
        }),
      // 弹出图层中间线
      stroke: new Stroke(
        {
          color: "#000000",
          width: 1
        })
    }),
  init : function(options) {
    var me = this;
    me.map = options.map;
    me.maxSelect=options.maxSelect||10;
    me.iconUrl = options.iconUrl;
    me.clusterSource = new Cluster({
      distance: 40,
      source: options.source
    });
    me.clusterLayer = new AnimatedCluster(
      {
        name: 'Cluster',
        source: me.clusterSource,
        animationDuration: 500,
        //利用bind()将当前的对象绑定到getStyle函数中，便于在getStyle函数作用域中拿到当前实例化对象的属性，
        style: this.getStyle.bind(this)//聚簇的样式,
      });
    me.map.addLayer(me.clusterLayer);
    me.selectCluster = new SelectCluster(
      {
        maxSelect:this.maxSelect,
        maxObjects:this.maxSelect,
        pointRadius: 20,//点击聚簇点弹出的图层，点之间的距离
        animate: true,
        featureStyle: me.openClusterstyle,
        style: function (f, res) {
          var cluster = f.get('features');
          if (cluster.length > 1) {
            var s =me.getStyle(f, res);
            return s;
          }
          else {
            return [
              new Style(
                {
                  image: new Icon(({
                    scale: 0.6,  //图标缩放比例
                    src: me.iconUrl //图标的url
                  }))
                })];
          }
        }
      });
    me.map.addInteraction(me.selectCluster);
  },
  getStyle: function (feature, resolution) {
    var me = this;
    var size = feature.get('features').length;
    var style = me.styleCache[size];
    if (size == 1) {//聚簇单点的样式
      if (!style) {
        style = me.styleCache[size] = new Style({
          image: new Icon(({
            scale: 0.4,  //图标缩放比例
            src: me.iconUrl //图标的url
          }))
        });
      }
    } else {//聚簇多点的样式
      if (!style) {
        var color = size > 40 ? "192,0,0" : size > 10 ? "255,128,0" : "0,128,0";
        var lineWidth = size > 40 ? 10 : size > 12 ?9 : 5;
        var radius = Math.max(10, Math.min(size * 0.75, 25));
        style = me.styleCache[size] = new Style(
          {
            image: new Circle(
              {
                radius: radius,
                stroke: new Stroke(
                  {
                    color: "rgba(" + color + ",0.5)",
                    width: lineWidth,
                  }),
                fill: new Fill(
                  {
                    color: "rgba(" + color + ",1)"
                  })
              }),
            text: new Text(
              {
                text: size.toString(),
                fill: new Fill(
                  {
                    color: '#fff'
                  })
              })
          });
      }
    }
    return [style];
  },
  //绑定选定事件，且小于me.maxSelect时触发
  onSelect(f){
    var me=this;
    this.selectCluster.getFeatures().on(['add'], function (e) {//图层点击方法
      var features = e.element.get('features');
      if(f&&features.length<=me.maxSelect){
        f(features)
      }

    });
  },
  //绑定切换选择事件，且小于me.maxSelect时触发
  outSelect(f){
    var me=this;
       this.selectCluster.getFeatures().on(['remove'], function (e) {
         var features = e.element.get('features');
         if(f&&features.length<=me.maxSelect){
           f(features)
         }
   });
  },
 //添加聚合图层
  addClusterLayer:function(){
    var me=this;
    me.map.addLayer(me.clusterLayer);
  },
  //移除聚合图层
  removeClusterLayer:function(){
    var me=this;
    me.map.removeLayer(me.clusterLayer);
  }
}

export default MTICluster;
