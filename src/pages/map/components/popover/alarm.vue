<template>
	<div class="popover">
    <address>报警位置:{{popData.lxdz || '未知'}}
      <el-button v-if="popData.ifAttention === 2" type="warning" icon="el-icon-plus" circle  size="mini" title="关注" @click="addAttention"></el-button>
      <el-button v-if="popData.ifAttention === 1" type="danger" icon="el-icon-minus" circle  size="mini" title="取消关注" @click="delAttention"></el-button>
    </address>
    <p>报警时间:{{popData.scbjsj}}</p>
    <p>报警类型:{{popData.jqlbmc}}</p>
    <p>报警人:{{(popData.bjr || "").split(',')[0]}}</p>
  </div>
</template>
<script>
  import bus from '@/libs/bus'
  import http from '@/api/http'
  import apis from '@/api'
  export default {
    name: 'popover-alarm',
    props: {
      popData: {
        Type:Object,
        default:() => {
        }
      }
    },
    methods: {
      addAttention() {
        http.post({
          api:apis.addForcesAlarm,
          param: {
          sjdbh:this.popData.sjdbh
          }
        }).then(res => {
          if (res.code === 200) {
            this.popData.ifAttention = 1
            this.$message('添加成功')
            bus.$emit('add-attention-alarm',this.popData)
          }
        })
      },
      delAttention() {
        this.popData.ifAttention = 2
        bus.$emit('del-attention-alarm', this.popData.sjdbh)
      }
    }
  }
</script>
<style lang="less" scoped>
.el-button--mini.is-circle {
  padding:2px;
}
address {
  font-size: 14px;
}
</style>