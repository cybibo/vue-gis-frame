/**
 * company:上海道枢信息
 * Time:2018-8-10
 * author:yuanlk
 * 互联网地图api接口封装
 */

const ak = {
  GDak: "b2d606f73d7b93785ec98a1bdc6f5e46",//高德地图ak
  BDak: "s2CEuwj3CcYvhp0A49k61xFI2UATrHAe",//百度地图ak
  TXak: "LMNBZ-3PWKP-IH5DR-VQX5P-TDQBE-5YFQI"//腾讯地图ak
}

const JSONP = {
  // 获取当前时间戳
  now: function() {
    return (new Date()).getTime();
  },
  // 获取随机数
  rand: function() {
    return Math.random().toString().substr(2);
  },

  removeElem: function(elem) {
    var parent = elem.parentNode;
    if(parent && parent.nodeType !== 11) {
      parent.removeChild(elem);
    }
  },
  // url组装
  parseData: function(data) {
    var ret = "";
    if(typeof data === "string") {
      ret = data;
    }else if(typeof data === "object") {
      for(var key in data) {
        ret += "&" + key + "=" + encodeURIComponent(data[key]);
      }
    }
    return ret;
  },

  getJSON: function(url, data, func) {
    let name;
    url = url + (url.indexOf("?") === -1 ? "?" : "&") + this.parseData(data);
    let match = /callback=(\w+)/.exec(url);
    if(match && match[1]) {
      name = match[1];
    } else {
      name = "jsonp_" + this.now() + '_' + this.rand();
      url = url+ "&callback="+name;
    }
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.id = "id_" + name;
    window[name] = function(json) {
      func(json);
      window[name] = undefined;
      let elem = document.getElementById("id_" + name);
      JSONP.removeElem(elem);
    };
    var head = document.getElementsByTagName("head");
    if(head && head[0]) {
      head[0].appendChild(script);
    }
  }
};


let ITMapAPI = {
  /**
   * 逆地理编码功能，根据经纬度查询地址
   * @param location  形如：[105.22,44,66]
   * @param typeCode  调用的服务类型，1：百度地图接口服务，2：高德地图接口服务，3：腾讯地图接口服务
   * @param callback   调用成功的回调函数
   */
  getAddressFromLocation(location, typeCode, callback) {
    if (typeCode === 1) {
      let data = {
        location: location[1] + "," + location[0],
        ak: ak.BDak,
        output:"json",
      }
      JSONP.getJSON("http://api.map.baidu.com/geocoder/v2/",data,callback);
    } else if (typeCode === 2) {
      let data = {
        location: location[0] + "," + location[1],
        key: ak.GDak
      }
      JSONP.getJSON("https://restapi.amap.com/v3/geocode/regeo",data,callback);
    } else if (typeCode == 3) {
      let data = {
        location: location[1] + "," + location[0],
        key: ak.TXak,
        output:"jsonp"
      }
      JSONP.getJSON("https://apis.map.qq.com/ws/geocoder/v1",data,callback);
    } else {
      //天地图地图接口调用。暂时不直接支持
    }
  },
  /**
   * 地理编码功能，根据地址查询经纬度
   * @param location  形如：“北京市中关村”
   * @param typeCode  调用的服务类型，1：百度地图接口服务，2：高德地图接口服务，3：腾讯地图接口服务
   * @param callback   调用成功的回调函数
   */
  getLocationFromAddress(address, typeCode, callback) {
    if (typeCode === 1) {
      let data = {
        address: address,
        ak: ak.BDak,
        output:"json",
      }
      JSONP.getJSON("http://api.map.baidu.com/geocoder/v2/",data,callback);
    } else if (typeCode === 2) {
      let data = {
        address: address,
        key: ak.GDak
      }
      JSONP.getJSON("https://restapi.amap.com/v3/geocode/geo",data,callback);
    } else if (typeCode == 3) {
      let data = {
        address: address,
        key: ak.TXak,
        output:"jsonp"
      }
      JSONP.getJSON("https://apis.map.qq.com/ws/geocoder/v1",data,callback);
    } else {
      //天地图地图接口调用。暂时不直接支持
    }
  },
  /**
   * 步行路径规划
   * @param start     如：[105.22,44,66]
   *  @param end      如：[105.22,44,66]
   * @param typeCode  调用的服务类型，1：百度地图接口服务，2：高德地图接口服务，3：腾讯地图接口服务
   * @param callback   调用成功的回调函数
   */
  getWalkPath(start,end,typeCode,callback){
    if (typeCode === 1) {
      let data = {
        origin: start[1]+","+start[0],
        destination:end[1]+","+end[0],
        ak: ak.BDak,
        output:"json",
      }
      JSONP.getJSON("http://api.map.baidu.com/direction/v2/riding",data,callback);
    } else if (typeCode === 2) {
      let data = {
        origin: start[0]+","+start[1],
        destination:end[0]+","+end[1],
        key: ak.GDak
      }
      JSONP.getJSON("https://restapi.amap.com/v3/direction/walking",data,callback);
    } else if (typeCode == 3) {
      let data = {
        from: start[1]+","+start[0],
        to:end[1]+","+end[0],
        key: ak.TXak,
        output:"jsonp"
      }
      JSONP.getJSON("https://apis.map.qq.com/ws/direction/v1/bicycling/",data,callback);
    } else {
      //天地图地图接口调用。暂时不直接支持
    }
  },
  /**
   * 公交路径规划
   * @param start     如：[105.22,44,66]
   *  @param end      如：[105.22,44,66]
   * @param typeCode  调用的服务类型，1：百度地图接口服务，2：高德地图接口服务，3：腾讯地图接口服务
   * @param callback   调用成功的回调函数
   */
  getTransitPath(start,end,typeCode,callback){
    if (typeCode === 1) {
      let data = {
        origin: start[1]+","+start[0],
        destination:end[1]+","+end[0],
        ak: ak.BDak,
        output:"json",
      }
      JSONP.getJSON("http://api.map.baidu.com/direction/v2/transit",data,callback);
    } else if (typeCode === 2) {
      let data = {
        origin: start[0]+","+start[1],
        destination:end[0]+","+end[1],
        key: ak.GDak
      }
      JSONP.getJSON("https://restapi.amap.com/v3/direction/transit/integrated",data,callback);
    } else if (typeCode == 3) {
      let data = {
        from: start[1]+","+start[0],
        to:end[1]+","+end[0],
        key: ak.TXak,
        output:"jsonp"
      }
      JSONP.getJSON("https://apis.map.qq.com/ws/direction/v1/transit/",data,callback);
    } else {
      //天地图地图接口调用。暂时不直接支持
    }
  },
  /**
   * 驾车路径规划
   * @param start     如：[105.22,44,66]
   *  @param end      如：[105.22,44,66]
   * @param typeCode  调用的服务类型，1：百度地图接口服务，2：高德地图接口服务，3：腾讯地图接口服务
   * @param callback   调用成功的回调函数
   */
  getDrivingPath(start,end,typeCode,callback){
    if (typeCode === 1) {
      let data = {
        origin: start[1]+","+start[0],
        destination:end[1]+","+end[0],
        ak: ak.BDak,
        output:"json",
      }
      JSONP.getJSON("http://api.map.baidu.com/direction/v2/driving",data,callback);
    } else if (typeCode === 2) {
      let data = {
        origin: start[0]+","+start[1],
        destination:end[0]+","+end[1],
        key: ak.GDak
      }
      JSONP.getJSON("https://restapi.amap.com/v3/direction/driving",data,callback);
    } else if (typeCode == 3) {
      let data = {
        from: start[1]+","+start[0],
        to:end[1]+","+end[0],
        key: ak.TXak,
        output:"jsonp"
      }
      JSONP.getJSON("https://apis.map.qq.com/ws/direction/v1/driving/",data,callback);
    } else {
      //天地图地图接口调用。暂时不直接支持
    }
  }
}

export default ITMapAPI;

