/**
 * company:上海道枢信息
 * Time:2018-9-27
 * author:yuanlk
 * gif格式图标图层类
 */

import proj from 'ol/proj';
import Overlay from 'ol/overlay';

let GIFLayer = function(options){
  this.init(options)
};
GIFLayer.prototype = {
    map: null,//地图对象
    mapElement:null,
    src: null,//地图图标路径
    width:40,//图标宽度
    height:40,//图标高度
    /**
     * 工具初始化函数
     */
    init: function (options) {
        let me = this;
        Object.assign(this, options)
        if(this.src){
            me.loadStyleString(".mti-giflayers{"+
            "height:"+this.height+"px;"+
            "width:"+this.width+"px;"+
            "background-image:url("+this.src+");"+
            "background-size:100% 100% }"
       );
      }else{
          console.error("图标路径未定义！")
      }
    },
    addFeature(feature){
         let overlayEle=document.createElement('div')
         overlayEle.setAttribute("class","mti-giflayers")
         overlayEle.setAttribute("id","mti-giflayers"+feature.properties.id)
         let newPoint=new Overlay({
             position:proj.fromLonLat(feature.geometry.coordinates),
             positioning:'center-center',
             element:overlayEle,
             stopEvent:false,
             id:feature.properties.id
         })
         newPoint.setProperties(feature.properties)
         this.map.addOverlay(newPoint)
    },
    addFeatures(collection){
        for(let i=0;i<collection.features.length;i++){
            this.addFeature(collection.features[i])
        }   
    },

    removeFeatureByID(ID){
        let newOverLay=this.map.getOverlayById(ID)
        if(newOverLay){
            this.map.removeOverlay(newOverLay)
        }
    },
    onClick(callback){
        this.mapElement=this.map.getTargetElement()
        this.mapElement.onclick=callback
    },
    unclick(){
        this.mapElement.onclick=null
    },
    onHover(callback){
        this.mapElement=this.map.getTargetElement()
        this.mapElement.onmouseover=callback
    },
    unHover(){
        this.mapElement.onmouseover=null
    },
    loadStyleString: function (css) {
        var style = document.createElement("style");
        style.type = "text/css";
        try {
            style.appendChild(document.createTextNode(css));
        } catch (ex) {
            style.styleSheet.cssText = css;
        }
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }
}

export default GIFLayer;


/**点击，及hover事件示例代码
 * 
 *       gifLayer.onClick(event=>{
         if(event.path[0].className==="mti-giflayers"){
           let id=event.path[0].id
           id=id.substring(13,id.length)
           let overlay=this.map.getOverlayById(id)
           console.log(id)
           console.log(overlay.getProperties().name)
         }else{

         }
      })

      gifLayer.onHover(event=>{
        console.log(event)
          if(event.path[0].className==="mti-giflayers"){
           let id=event.path[0].id
           id=id.substring(13,id.length)
           let overlay=this.map.getOverlayById(id)
           this.iconName=overlay.getProperties().name
           this.pointHoverBool=true
           this.hoverStyle.top = event.y + 'px'
           this.hoverStyle.left = event.x + 'px'
           
         }else{
           this.pointHoverBool=false

         }
      })
 * 
 */









