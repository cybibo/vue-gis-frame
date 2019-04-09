/**
 * company:上海道枢信息
 * Time:2018-6-19
 * author:yuanlk
 * poi分类展示
 */

import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';

var classifyPOI = function(options){
  this.init(options)
};
classifyPOI.prototype = {
    layer: false,
    imgParams: null,
    iconParams: null,
    styleArray:null,
    levelArray:null,
    levelAttr:null,
    init: function (options){
        this.styleArray=[];
        var me = this;
        Object.assign(this, options);
        this.yeildStyleArray();
        this.layer.setStyle(this.styleFunction.bind(me));
    },
    yeildStyleArray:function(){
        for(var i=0;i<this.levelArray.length;i++){
            var image=null;
            if(this.iconParams){//如果传入符号参数则使用符号
                image=new Circle({
                    radius: this.iconParams[i].radius,//圆的半径
                    stroke: new Stroke({
                        color: this.iconParams[i].pointStrokeColor||"rgba(0,0,0,0)",//圆环的颜色
                        width: this.iconParams[i].pointStrokeWidth||0//圆环的宽度
                    }),
                    fill: new Fill({
                        color: this.iconParams[i].pointFillColor//圆的填充颜色
                    })
                })
            }else {
                image=new Icon({
                    scale: this.imgParams[i].imgScale,//符号图片的缩放比例0-1
                    src: this.imgParams[i].imgPath//图片的路径
                })
            }
            this.styleArray.push(new Style({image:image}))
        }
    },
    styleFunction: function (feature) {//样式函数
        var level=feature.getProperties()[this.levelAttr];
        var levelIndex=this.levelArray.indexOf(level);
        if(levelIndex>=0){
            return this.styleArray[levelIndex]
        }
    }
}

export default classifyPOI;
