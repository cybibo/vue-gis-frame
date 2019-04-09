<template>
	<div class="popover">
    <p>姓名:{{popData.name}}<el-tag v-if="popData.ifOnline" size="mini">{{popData.ifOnline}}</el-tag>
      <el-button v-if="popData.ifAttention === 2" type="warning" icon="el-icon-plus" circle  size="mini" title="关注" @click="addAttention"></el-button>
      <el-button v-if="popData.ifAttention === 1" type="danger" icon="el-icon-minus" circle  size="mini" title="取消关注" @click="delAttention"></el-button>
    </p>
    <p>所属:{{popData.policeUnit}}</p>
    <p>类型:{{pointType}}</p>
    <el-row class="popover-btn">
      <el-col :span="8">
        <el-button size="mini" type="primary">呼叫</el-button>
      </el-col>
      <el-col :span="8" style="text-align:center">
      <el-button size="mini" type="info" @click="selMsg('短信')">短信</el-button>
      </el-col>
      <el-col :span="8" style="text-align:right">
      <el-button size="mini" type="success" @click="selMsg('微信')">微信</el-button>
      </el-col>
    </el-row>
    <!--消息输入框-->
    <el-form class="f-m-t-5" :model="msgForm" :rules="rules" v-if="show" ref="msgForms">
      <el-form-item
        prop="msgContent">
        <el-input type="textarea" placeholder="请输入内容" v-model="msgForm.msgContent" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" :mode="msgType" @click="sendMsg">{{msgType}}发送</el-button>
        <el-button size="mini" @click="resetForm('msgForms')">重置</el-button>
      </el-form-item>
    </el-form>
	</div>
</template>
<script>
import bus from '@/libs/bus'
import http from '@/api/http'
import apis from '@/api'
  export default {
    name: 'popover-police',
    data() {
      return {
        show:false,
        msgType:'',
        msgForm:{
          msgContent:'',
        },
        params: {
          "address": 'string',
          "resourceId": 'string',
          "sjdId": ''
        }
      }
    },
    props: {
      popData: {
        Type:Object,
        default:() => {}
      }
    },
    computed: {
    	pointType() {
    		return this.popData.pointType === 1 ? "手台" : "PDA"
    	},
      idCard() {
        return this.popData.idCard
      },
      getAlarmId () {
        return this.$store.state.app.alarmId
      },
      rules () {
      return {
        msgContent:[{ required: true, message: '内容不能为空'}]
        }
      }
    },
    methods: {
      addAttention() {
        http.post({
			api:apis.addForcesPolicePower,
			param:{
	          resourceId:this.popData.id,
            sjdId:this.getAlarmId
	        }
        }).then(res => {
           if (res.code === 200) {
            this.$message('关注成功')
            this.popData.ifAttention = 1
            bus.$emit('add-attention-police')
          }else if(res.code === 210) {
            this.$message(res.data.message)
          }
        })
      },
      delAttention() {
        this.popData.ifAttention = 2
        bus.$emit('del-attention-police',this.popData.id)
      },
      // 消息输入框显示隐藏
      selMsg(msgtype) {
        this.show = true
        this.msgType = msgtype
      },
      sendMsg() {
        this.$refs.msgForms.validate((valid) => {
        if (valid) {
          if( this.msgType === "微信" ) {
            http.post({
            api:apis.sendMsgWeixin,
            param:{
              content:this.msgForm.msgContent,
              userList:[
              {
               userid: this.idCard
             }]
            }
          }).then(res => {
            if(res.respCode === 200) {
              this.$message({
                type:'success',
                message:res.data.resultMsg
                })
              }
            })
            }else{
              console.log('短信')
            }
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style lang="less" scoped>
.el-button--mini.is-circle {
  padding:2px;
}
.el-form-item {
  margin-bottom: 12px;
}
.input-box {
  margin-top: 5px;
  text-align: right;
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-button {
    height: 30px;
  }
}
</style>
