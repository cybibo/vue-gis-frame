
let webSokDuty = {

}
webSokDuty.edutyNewIncident = (item) => {
  if (item.rotetPath === '/eduty/duty') {
    console.log('你是当前页面', item)
  }
}
webSokDuty.online = (item) => {
  console.log('222', item)
}
webSokDuty.forcedOffline = (item) => {
  console.log('333', item)
}

export default webSokDuty
