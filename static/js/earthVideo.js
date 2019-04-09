const earthVideo = {}
earthVideo.playObj = null
earthVideo.InitAX = function (obj) {
  earthVideo.playObj = document.getElementById('earthAX')
  var result = earthVideo.playObj.InitAX()
  if (result !== 0) {
    alert('初始化失败')
  }
}

earthVideo.playCam = function (conf) {
  var result = earthVideo.playObj.PlayVideo(JSON.stringify(conf))
  if (result !== 0) {
    alert('播放失败')
  }
}

earthVideo.closeCam = function () {
  var result = earthVideo.playObj.CloseVideo()
  if (result !== 0) {
    alert('停止失败')
  }
}

earthVideo.startPTZ = function (ptzCommand) {
  var result = earthVideo.playObj.StartPtz(ptzCommand)
  if (result !== 0) {
    alert('PTZ操作失败')
  }
}

earthVideo.endPTZ = function (ptzCommand) {
  var result = earthVideo.playObj.EndPtz(ptzCommand)
  if (result !== 0) {
    alert('PTZ操作失败')
  }
}

earthVideo.disposeSdk = function () {
  var result = earthVideo.playObj.DisposeSDK()
  if (result !== 0) {
    alert('失败')
  }
}

export default earthVideo
