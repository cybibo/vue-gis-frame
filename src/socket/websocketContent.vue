<template>
    <div>
      <!-- 消息连接 -->
      <div ref="alarm"> </div>
    </div>
</template>

<script>
import http from '@/api/http'
import apis from '@/api'
import { msgUrl } from '@/api'
import { mapActions, mapState } from 'vuex';
import { getCookies } from '@/libs/util'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
export default {
  components: {
    SockJS,
    Stomp
  },
  data () {
    return {
        status: false,
        global:{},
        socket: null
    };
  },
  methods: {
    ...mapActions([
      'setWebsocketData', // 存websocket信息
      'removeWebsocketData', // 删除当前对象
      'clearWebsocketData', // 清除存储的消息
    ]),
    /**
         * 获取系统根路径
         *
         * @returns 返回系统的根路径：http://ip:port/serverName
         */
    // websocket开始
    getUserCodeFromCookie () {
      const userCode = getCookies('usercode')
      if (userCode === null || userCode === 'null') {
        // 返回空串
        return '';
      }
      //	Cookie.set('userCode',userCode);
      return userCode;
    },
    // 获取持久化消息
    queryNewMessages4Org(){
        let param = {
            userCode: getCookies('usercode'),
            orgQueryCode: getCookies('orgquerycode')
        };
        http.post({
          api:apis.msgSocket,
          param:param
        }).then(res => {
            if (res.data) {
            if (res.code === 200) {
                let data = res.data;
                if( data && data.length > 0 ){
                    for(let i = 0; i < data.length; i++){
                        this.$refs.alarm.alarm_AddWebsocketMsg(data[i]);
                    }
                }
            }
        }
    });
    },
    /**
         * 获取用户的地区科室
        */
    getCurrentUserInfo () {
      const userCode = getCookies('usercode');
      const userName = getCookies('username');
      const regionId = getCookies('regionid');
      const regionQueryCode = getCookies('regionquerycode');
      const orgId = getCookies('orgid');
      const orgName = getCookies('orgname');
      const orgQueryCode = getCookies('orgquerycode');
      const userType = getCookies('usertype');
      const categoryId = getCookies('categoryid');
      const personId = getCookies('userid');
      const token = getCookies('token');
      const currentInfo = {
        userCode,
        userName,
        regionId,
        regionQueryCode,
        orgId,
        orgName,
        orgQueryCode,
        userType,
        categoryId,
        personId,
          token
      };
      return currentInfo;
    },
    getSocketMsg (callback) {
      let _this = this;
      var socket = new SockJS(msgUrl + '/msg-websocket');
      this.socket = socket
      this.global.stompClient = Stomp.over(socket)
      let userInfo = this.getCurrentUserInfo()
      this.global.stompClient.connect(userInfo, function(frame) {
      //_this.queryNewMessages4Org();
      this.subscribe('/user/'+ userInfo.userCode+'/msg',  (event) => {
        //console.log('我已经接收到消息了', event.body);
        //初始进来应该清空重新装
        let eventData = JSON.parse(event.body);
        console.log(eventData)
        if(eventData.msgCode === 'alarmNumber') {
          let data = {
            title: '今日警情超过阈值',
            limit: 270,
            number: Number(eventData.objKey)
          }
          _this.$store.state.app.alarmNum.push(data)
        }
        else if (eventData.msgCode === 'newAlarm') {
          if(callback){
            callback(eventData)
          }
        } else {
          console.warn("消息格式未定义")
        }

      })
    })
    }
  }
};
</script>

