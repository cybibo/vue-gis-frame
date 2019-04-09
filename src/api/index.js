/**
 * Created by chenyb on 22/10/18.
 * API命名配置列表
 * 命名规则：驼峰式命名方式，动词放前面，名词放后面，
 * 如:addFeatures
 * API命名变量不要太过长
 */
import config from '@/config';
let baseUrl;
let msgUrl;
let eventUrl;
let activUrl;
let adminUrl;
switch (process.env.NODE_ENV) {
  //生产环境
  case 'production':
    baseUrl = config.baseUrl.pro;
    msgUrl = config.messageUrl.pro;
    eventUrl = config.eventUrl.pro;
    activUrl = config.activUrl.pro;
    adminUrl = config.adminUrl.pro;
    break;
  //测试环境
  case 'testing':
    baseUrl = config.baseUrl.tes;
    msgUrl = config.messageUrl.tes;
    eventUrl = config.eventUrl.tes;
    activUrl = config.activUrl.tes;
    adminUrl = config.adminUrl.tes;
    break;
  default:
    //开发环境
    baseUrl = config.baseUrl.dev;
    msgUrl = config.messageUrl.dev;
    eventUrl = config.eventUrl.dev;
    activUrl = config.activUrl.dev;
    adminUrl = config.adminUrl.dev;
    break;
}
export { baseUrl, msgUrl, eventUrl, activUrl, adminUrl };
export default {
  //**系统管理**开始
  getMapData: adminUrl + '/getMapData',
  getSafeLevel: adminUrl + '/getSafeLevel', //安全等级
  getJurisdiction: adminUrl + '/getJurisdiction', //辖区状况
  getControll: adminUrl + '/getControll', //重点布控
  getModelInfo: adminUrl + '/getModelInfo', //数据模型&舆情摘要
  getScenicSpot: adminUrl + '/getScenicSpot', //景区滞留
  getPhysicalWarn: adminUrl + '/getPhysicalWarn', //物感预警

  //人员管理
  orgTree: adminUrl + '/platform/org/selectAllOrg', //组织结构树
  orgPersonList: adminUrl + '/platform/person/queryPersonBase4Paging', //按组织分页查询人员
  addPerson: adminUrl + '/platform/person/addPerson', //添加人员
  updatePerson: adminUrl + '/platform/person/updatePerson', //更新人员信息
  deletedPerson: adminUrl + '/platform/person/deletedPerson', //删除人员
  getDutyList: adminUrl + '/platform/baseDuty/queryAllBaseDuty', //查询所有职务

  //日志管理
  logHistory: adminUrl + '/platform/log/logs', //日志列表

  // 菜单管理
  menuId: adminUrl + '/platform/module/getModuleByModuleId', //根据菜单编号查询菜单信息
  searchMenuInfo: adminUrl + '/platform/module/getModules', //查询菜单信息
  addMenu: adminUrl + '/platform/module/addModule', //新增菜单
  editMenu: adminUrl + '/platform/module/updateModule', //修改菜单
  delMenu: adminUrl + '/platform/module/deleteModule', //删除菜单

  //用户管理
  addUser: adminUrl + '/platform/user/add', //新建用户
  searUserInfo: adminUrl + '/platform/user/getUserInfo', //查询用户信息
  deleteUrl: adminUrl + '/platform/user/deleteUserInfo', //删除用户信息
  resetUrl: adminUrl + '/platform/user/resetPassword', //重置密码
  singleUrl: adminUrl + '/platform/user/getUserInfoByUserId', //根据userId查询单个用户信息
  amendUrl: adminUrl + '/platform/user/updateUserInfoByUserId', //修改单个用户信息
  getPersonInfo: adminUrl + '/platform/user/getPersonInfo', //查询人员信息
  getUserByCode: adminUrl + '/platform/user/getUserByCode', //查询账户名称是否重复
  //角色管理
  roleMaintain: adminUrl + '/platform/role/querySimplRoleManage', //角色管理 查询所有角色
  addRole: adminUrl + '/platform/role/saveRole', //角色管理 新增角色
  editRole: adminUrl + '/platform/role/updateRole', //角色管理 修改角色
  delRole: adminUrl + '/platform/role/deleteRole', //角色管理 删除角色
  //权限管理
  getAuthor: adminUrl + '/platform/role-module/access-control', //权限管理 根据角色查询权限
  getAuthorMenu: adminUrl + '/platform/role-module/access-control/menu', //权限管理 根据角色查询权限菜单
  setAuthor: adminUrl + '/platform/role-module/access-controls', //权限管理 权限变更

  //系统设置
  getSystemInfo: adminUrl + '/platform/setting/infos', //显示系统配置
  postSystemInfo: adminUrl + '/platform/setting/infos', //获取系统配置

  //**系统管理**结束

  login: adminUrl + '/platform/login/toLogin',
  logout: adminUrl + '/platform/login/logout',
  getMenusList: adminUrl + '/platform/login/getUserModules',
  updatePassword: adminUrl + '/platform/user/updatePassword',
  uploadImg: baseUrl + '/gateway/upload/image',
  getUserInfo: adminUrl + '/platform/user/getUserInfoByToken',
  msgSocket: msgUrl + '/message/queryNewMessages4Org', //离线消息列表查询
  alarmRound: eventUrl + '/Alarm/getAlarmResource', // 警情包围圈内资源
  alarmList: eventUrl + '/Alarm/getAlarms', // 警情列表
  searchAlarm: eventUrl + '/Alarm/getAlarms', //搜索警情
  alarmAnimus: eventUrl + '/spite/getSpite', // 恶意报警
  activityRound: '/service/weixin/safeEventList', //周边活动
  sendMsgWeixin: '/service/adjusttask/sendInfo', //发送微信消息
  curAlarmList: eventUrl + '/Alarm/getAroundAlarms', //今日警情列表
  alarmNum: eventUrl + '/casenumber/getNumber', // 警情数量
  searchCamera: eventUrl + '/camera/getCamera', // 查询摄像头
  searchCar: eventUrl + '/policeCar/getPolicCar', // 查询警车信息
  searchPolice: eventUrl + '/policeman/getPoliceman', // 查询警员信息
  searchOrgList: eventUrl + '/AllResources/getResourcesAll', // 查询组织信息
  searchDanger: eventUrl + '/danger/getDanger', // 查询风险信息
  forcesAlarm: eventUrl + '/focusJq/getAllFocusJq', // 关注警情
  delFocusAlarm: eventUrl + '/focusJq/removeFocusJq', // 取消关注警情
  focusPolice: eventUrl + '/caseFollow/getFollowAll', // 关注警力
  delFocuspolice: eventUrl + '/caseFollow/removeFollow', // 取消关注警力
  addForcesPolicePower: eventUrl + '/caseFollow/addFollow', // 添加关注警力
  searCameraExt: eventUrl + '/search/getCamera', // 添加搜索监控信息
  searCameraApi: eventUrl + '/getPolice/getPoliceByMsg', //条件搜索警力
  addForcesAlarm: eventUrl + '/focusJq/addFocusJq', // 添加关注警情
  hospiApi: eventUrl + '/hospital/getHospital', //周边医院信息
  parkingApi: eventUrl + '/parkinglot/getParkingLot', //周边停车场信息
  schoolApi: eventUrl + '/school/getSchool', //周边学校信息
  weatherShow: eventUrl + '/weather/getweather', //天气信息

  policedayApi: eventUrl + '/Situation/getTodayAlarms', //今日各辖区警情数
  hourApi: eventUrl + '/Situation/getHoursAlarm', //获取24小时警情数
  sirensApi: eventUrl + '/Situation/getThresholdLevel', //获取警情阈值级别
  sirensGaiApi: eventUrl + '/Situation/updateThresholdsAndLevel', //修改派出所,警情阈值的值级别
  stationApi: eventUrl + '/Situation/getThresholds', //获取派出所警情阈值
  averageApi: eventUrl + '/Situation/getAverageAlarms', //获取年月日平均警情数

  categoriesUrl: eventUrl + '/history/getAlarmJqlb', //查询警情类别
  IntryHistory: eventUrl + '/history/getAlarmsByYear', //查询近三年警情历史数据
  Jurishistory: eventUrl + '/history/getAlarmsNumber', //查询近三年各辖区历史数据
  Intheindustry: eventUrl + '/history/getAlarmsNumberByTimeAll', //自定义时间查询全区警情数量接口
  policestations: eventUrl + '/history/getAlarmsNumberByTimePcs', //自定义时间查询各派出所警情数量接口
  apiCompared: eventUrl + '/history/getAlarmsTongBi', //历史同比
  apiChain: eventUrl + '/history/getAlarmsHuanBi', //历史环比
  keyAreaurl: eventUrl + '/keyAreas/getKeyAreas', //重点区域


  getTravelInfo: adminUrl + '/getTravelInfo',//交通信息
};
