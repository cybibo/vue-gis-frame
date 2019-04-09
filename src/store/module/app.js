import http from '@/api/http'
import apis from '@/api'
import { setCookies, getCookies, removeCookies } from '@/libs/util'
export default {
  state: {
    messageCount: 0,
    title:getCookies('title'),
    logo:getCookies('logo'),
    alarmCenter:{       //警情中心坐标
      lng:121.440299,   //X坐标
      lat:31.180558,    //Y坐标
      radius:100       //半径
    },
    alarmId:'',
    alarmList: [],
    alarmNum: [],
  },
  mutations: {
    setAlarmCenter ( state, center ) {
      state.alarmCenter.lng = parseFloat(center.lng)
      state.alarmCenter.lat = parseFloat(center.lat)
      if(center.radius){
        state.alarmCenter.radius = center.radius
      }
    },
    setAlarmRadius ( state, radius ) {
      state.alarmCenter.radius = radius
    },
    setAlarmId ( state, alarmid ) {
      state.alarmId = alarmid
    },
    addAlarmList ( state, data ) {
      state.alarmList.unshift(...data)
    },
    setTitle ( state, data ) {
      state.title = data
      setCookies('title',data)
    },
    setLogo ( state, images) {
      state.logo = images
      setCookies('logo',images)
    }
  },
  actions: {
    // 获到系统设置信息
    getSystemInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          http.get({
            api:apis.getSystemInfo
          }).then(res => {
            if(res.code === 200){
            	let setTitle;
            	let setLogo;
            	if (res.data && res.data.length > 0) {
            		res.data.forEach(item => {
            				if(item.id === "1") {
		                  setTitle = item.value;
		                }
		                if(item.id === "2") {
		                  setLogo = item.value;
		                }
            		})
            	}
              commit('setTitle', setTitle)
              commit('setLogo', setLogo)
            }
            resolve(res.code)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
