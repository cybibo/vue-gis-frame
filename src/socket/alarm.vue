<template>
    <!-- 报警器 -->
    <div></div>
</template>
<script>
import { mapActions } from 'vuex';
    export default {
      computed: {
        messageData () {
            return this.$store.state.websocket.messageData;
        }
      },
      methods: {
        ...mapActions([
          'setWebsocketData', // 存websocket信息
          'removeWebsocketData', // 删除当前对象
          'setmessageRemind', // 存声音控制
          'setSocketOperate', // 设置是否调用页面方法
          'setSocketObjKey',
          'setSocketContent'
        ]),
        alarm_RemoveWebsocketMsg (msg) {
          console.log('this.messageData', this.messageData)
          console.log('remove', msg);
          const content = JSON.parse(msg.content);
          const msgCode = content.removeMsgCode;
          const objKey = content.objKey;
            const messageData = this.messageData;
            for (let i = 0; i < messageData.length; i++) {
                if (msgCode === messageData[i].msgCode && objKey == messageData[i].objKey) {
                    messageData.splice(i, 1);
                    break;
                }
            }
            if (msg.msgCode === 'removeMessage') {
                this.setSocketContent(content)
                this.setSocketObjKey(content.objKey)
                this.setSocketOperate(msg.msgCode);
            }
          this.setmessageRemind(false);
        },
        getUrlData () {
          // 获取url参数
          const url = window.location.href;
          const data = url.split('#')[1];
          return data;
        }
      }
    }
</script>

