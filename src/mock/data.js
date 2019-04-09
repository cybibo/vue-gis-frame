import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
const Random = Mock.Random

export const getTableData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      createTime: '@date'
    }))
  })
  return tableData
}

export const getDragList = req => {
  let dragList = []
  doCustomTimes(5, () => {
    dragList.push(Mock.mock({
      name: Random.csentence(10, 13),
      id: Random.increment(10)
    }))
  })
  return dragList
}

export const uploadImage = req => {
  return Promise.resolve()
}

export const getTravelInfo = req => {
  let info = [];
  let randomData = ["新松江路至江学路1辆汽车抛锚", "文汇路至龙腾路2车相撞", "文祥路至龙腾路拥堵"];
  doCustomTimes(7, () => {
    let no = Math.floor(Math.random() * randomData.length);
    info.push(Mock.mock({
      "id": Random.increment(),
      "name": randomData[no],
      "time": Random.date('HH:mm'),
    }));
  })
  return {
    "code": 200,
    "message": "成功",
    "data": info
  }
}
