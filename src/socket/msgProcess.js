// 需要做2件事情，是不是应该提醒的消息类型，是不是需要对对应的页面进行重新渲染
import webSokDuty from '@/common/components/websocket/websocketMsg4Duty'
let msgProcess = {

}

// 上线
msgProcess['online'] = {
  method: webSokDuty.edutyNewIncident,
  audio: false,
  messageType: 'online',
  url: '',
  msgRemind: false,
  iconType: 'flag'
}
// 新警情消息
msgProcess['newIncident'] = {
  method: webSokDuty.online,
  audio: false,
  messageType: 'newIncident',
  url: '',
  msgRemind: true,
  iconType: 'flag'
}
// 新事件消息
msgProcess['newDispatch'] = {
  method: webSokDuty.online,
  audio: false,
  messageType: 'newDispatch',
  url: '',
  msgRemind: true,
  iconType: 'flag'
}
// 新指令消息（内部刷新）
msgProcess['newCommand'] = {
  method: webSokDuty.online,
  audio: false,
  messageType: 'newCommand',
  url: '',
  msgRemind: false,
  iconType: 'flag'
}
// 指令状态改变消息
msgProcess['commandStatusChange'] = {
  method: webSokDuty.online,
  audio: false,
  messageType: 'commandStatusChange',
  url: '',
  msgRemind: false,
  iconType: 'flag'
}
// 新到场反馈消息
msgProcess['newArriveFeedback'] = {
  method: webSokDuty.online,
  audio: false,
  messageType: 'newArriveFeedback',
  url: '',
  msgRemind: true,
  iconType: 'flag'
}
// 到场反馈指令状态改变消息
msgProcess['commandAlreadyArriveFeedback'] = {
  method: webSokDuty.online,
  audio: false,
  messageType: 'commandAlreadyArriveFeedback',
  url: '',
  msgRemind: false,
  iconType: 'flag'
}
// 新办结反馈消息
msgProcess['newFinishFeedback'] = {
  method: webSokDuty.online,
  audio: false,
  messageType: 'newFinishFeedback',
  url: '',
  msgRemind: true,
  iconType: 'flag'
}
// 办结反馈指令状态改变消息
msgProcess['commandAlreadyFinishFeedback'] = {
  method: webSokDuty.online,
  audio: false,
  messageType: 'commandAlreadyFinishFeedback',
  url: '',
  msgRemind: false,
  iconType: 'flag'
}
// 协同指挥-新事件消息(内部)示例
// msgProcess['scdNewInsideIncident'] = {
//   method: webSokDuty.online,
//   audio: false,
//   messageType: 'scdNewInsideIncident',
//   url: '',
//   msgRemind: false,
//   iconType: 'flag'
// }
// 强制退出系统
msgProcess['forcedOffline'] = {
  method: webSokDuty.forcedOffline,
  audio: false,
  messageType: 'forcedOffline',
  url: '',
  msgRemind: false,
  iconType: 'flag'
}

export default msgProcess
