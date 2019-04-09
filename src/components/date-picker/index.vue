<template>
  <div class="date-picker">
    <div class="date-title">
      <div class="name">起止时间：</div>
      <div class="start-stop-time">
        <el-date-picker v-model="date_picker.startTime" type="date" placeholder="开始日期"></el-date-picker>
        <span class="middle-line">--</span>
        <el-date-picker v-model="date_picker.stopTime" type="date" placeholder="结束日期"></el-date-picker>
      </div>
      <div class="total">共<span class="num">{{ date_picker.num }}</span>条</div>
    </div>
  </div>
</template>
<script>
import http from "@/api/http";
import apis from "@/api";
export default {
  props: {
    date_picker: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
.date-picker {
  .date-title {
    display: flex;
    flex-direction: row;
    height: 60px;
    line-height: 60px;
    background: #00162E;
    opacity: 0.9;
    border-bottom: 1px dashed #0050A8;
    .name {
      width: 100px;
      text-align: right;
      color: #A9B8D3;
    }
    .start-stop-time {
      flex: 1;
      .middle-line {
        margin: 0 15px;
      }
    }
    .total {
      width: 200px;
      text-align: right;
      color: #4ABDFF;
      padding-right: 20px;
      font-size: 18px;
      .num {
        color: #fff;
        margin: 0 5px;
      }
    }
  }
}
</style>
<style lang="less">
/* 修改DateOicker日期样式 */
.el-input--suffix .el-input__inner {
  // padding-left: 20px;
  // padding-right: 35px;
  background-color:rgba(0,25,54,1);
  border: 1px solid rgba(4, 73, 149, 1);
  color: #fff;
  // width: 80%;
}
.el-input__prefix {
  // right: 2px;
}
</style>
