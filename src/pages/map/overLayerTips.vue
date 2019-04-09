<template>
  <div class="container">
    <el-card class="box-card">
      <div class="item"><span class="label">原始地址：</span><span class="value">{{popupData.origAddress}}</span></div>
      <div class="item"><span class="label">匹配地址：</span><span class="value">{{popupData.patAddress}}</span></div>
      <!-- <div class="item"><span class="label">经过过滤的分词：</span><span class="value">{{popupData.kewords}}</span></div>
      <div class="item"><span class="label">POI中查出的坐标：</span><span class="value">{{popupData.POIcoordinates}}</span></div>
      <div class="item"><span class="label">POI中查出的地址：</span><span class="value">{{popupData.POIAddress}}</span></div>
      <div class="item"><span class="label">原始地址高德匹配：</span><span class="value">{{popupData.originalGaoDecoordinates}}</span></div>
      <div class="item"><span class="label">过滤处理后高德匹配：</span><span class="value">{{popupData.filterGaoDecoordinates}}</span></div>
      <div class="item"><span class="label">高德反查询POI坐标：</span><span class="value">{{popupData.GaoDePOIAddress}}</span></div>
      <div class="item"><span class="label">高德反查询POI坐标：</span><span class="value">{{popupData.filterAddress}}</span></div> -->
    </el-card>

  </div>
</template>
<script>
export default {
  props: {
    popupData: {
      required: true,
      type: Object
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.container {
  color: #fff;
  text-align: left;
  .item {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
  }
  .label {
    color: #f40;
  }
  >>> .el-card.is-always-shadow,
  >>> .el-card.is-hover-shadow:focus,
  >>> .el-card.is-hover-shadow:hover {
    box-shadow: 4px 4px 12px 0 rgba(0, 0, 0, 0.3), -4px -4px 12px 0 rgba(0, 0, 0, 0.3);
  }
}
</style>