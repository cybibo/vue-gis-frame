
export default {
  state: {
    messageData: [],
    messageRemind: false, // 默认是没有声音的
    messageNuber: 0,
    openMessage: false,
    routerPath: '',
    socketOperate: '',
    socketObjKey: null,
    refugeReason: '',
    socketContent: ''
  },
  mutations: {
    setMessageData (state, messageArray) {
      state.messageData.push = messageArray
    },
  },
  actions: {
  }
}
