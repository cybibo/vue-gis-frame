import Mock from 'mockjs';
import { getMapData } from './map';
import { getTableData, getDragList, uploadImage, getTravelInfo } from './data'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
});
// 模拟数据
Mock.mock(/\/getMapData/, getMapData);



//交通信息
Mock.mock(/\/getTravelInfo/, getTravelInfo)

export default Mock;