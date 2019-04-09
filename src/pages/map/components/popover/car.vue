<template>
	<div class="popover">
    <p class="carNum">车牌号:{{popData.pcNumber}}</p>
    <el-button v-if="popData.ifAttention === 2" type="warning" icon="el-icon-plus" circle  size="mini" title="关注" @click="addAttention"></el-button>
      <el-button v-if="popData.ifAttention === 1" type="danger" icon="el-icon-minus" circle  size="mini" title="取消关注" @click="delAttention"></el-button>
    <p>所属:{{popData.policeUnit}}</p>
    <el-row class="popover-btn">
      <el-col :span="8">
        <el-button size="mini" type="primary">呼叫</el-button>
      </el-col>
      <el-col :span="8" style="text-align:center">
      <el-button size="mini" type="info" @click="goShow" >短信</el-button>
      </el-col>
      <el-col :span="8" style="text-align:right">
      <el-button size="mini" type="success" @click="goShow">微信</el-button>
      </el-col>
    </el-row>
    <!--消息输入框-->
    <el-row class="input-box" v-show="hiddeIn">
      <el-col :span="18">            
        <el-input placeholder="请输入内容" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-button size="mini" type="primary">发送</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import bus from '@/libs/bus'
  import http from '@/api/http'
  import apis from '@/api'
  export default {
    name: 'popover-car',
    data() {
      return {
        hiddeIn:false,
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
        default: () => {}
      }
    },
    computed: {
      getAlarmId () {
        return this.$store.state.app.alarmId
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
            this.$message('添加成功')
            this.popData.ifAttention = 1
            bus.$emit('add-attention-police')
          }
        })
      },
      delAttention() {
        http.post({
          api:apis.delFocuspolice,
          param:{
          id:this.popData.id
          }
        }).then(res => {
          if (res.code === 200) {
            this.popData.ifAttention = 2
            bus.$emit('del-attention-police',this.popData.id)
          }
        })
      },
      // 消息输入框显示隐藏
      goShow(){
        this.hiddeIn=!this.hiddeIn
      }
    }
  }
</script>
<style lang="less" scoped>
.el-button--mini.is-circle {
  padding:2px;
}
.carNum{
  display: inline;
}
.favor{
  float: right;
  font-size: 22px;
  color: #E05B56;
  display: inline;
  cursor: pointer;
}
</style>
