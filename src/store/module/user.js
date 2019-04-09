import http from '@/api/http'
import apis from '@/api'
import {
  setCookies,
  getCookies,
  removeCookies
} from '@/libs/util'
export default {
  state: {
    userName: getCookies('username'),
    userId: getCookies('userid'),
    userType: getCookies('usertype'),
    userCode: getCookies('usercode'),
    orgId: getCookies('orgid'),
    orgName: getCookies('orgName'),
    orgQueryCode: getCookies('orgquerycode'),
    regionId: getCookies('regionid'),
    regionQueryCode: getCookies('regionquerycode'),
    menusList: [],
    token: getCookies('token'),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: []
  },
  mutations: {
    setUserName(state, username) {
      state.userName = username
      setCookies('username', username)
    },
    setUserId(state, userid) {
      state.userId = userid
      setCookies('userid', userid)
    },
    setUserType(state, usertype) {
      state.userType = usertype
      setCookies('usertype', usertype)
    },
    setUserCode(state, usercode) {
      state.userCode = usercode
      setCookies('usercode', usercode)
    },
    setOrgId(state, orgid) {
      state.orgId = orgid
      setCookies('orgid', orgid)
    },
    setOrgName(state, orgname) {
      state.orgName = orgname
      setCookies('orgname', orgname)
    },
    setOrgQueryCode(state, orgquerycode) {
      state.orgQueryCode = orgquerycode
      setCookies('orgquerycode', orgquerycode)
    },
    setRegionId(state, regionid) {
      state.regionId = regionid
      setCookies('regionid', regionid)
    },
    setRegionQueryCode(state, regionquerycode) {
      state.regionQueryCode = regionquerycode
      setCookies('regionquerycode', regionquerycode)
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      //setToken(token)
      setCookies('token', token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setMessageCount(state, count) {
      state.unreadCount = count
    },
    setMenuList(state, list) {
      state.menusList = list
    },
    setMessageUnreadList(state, list) {
      state.messageUnreadList = list
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length
  },
  actions: {
    // 登录
    handleLogin({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        try {
          http.post({
            // api:apis.login,
            api: 'http://10.168.4.14:9080/system/user/connect/login?userName=' + data.userCode + '&password=' + data.password,
            param: {
              userCode: data.userCode,
              password: data.password
            }
          }).then(res => {
            if (res.code === 200) {
              const _data = res.data
              commit('setToken', _data.token)
              commit('setUserName', _data.user.name)
              commit('setUserId', _data.user.personId)
              commit('setUserType', _data.user.userType)
              commit('setUserCode', data.userCode)
              commit('setOrgId', _data.user.orgId)
              commit('setOrgName', _data.user.orgName)
              commit('setOrgQueryCode', _data.user.regionQueryCode)
              commit('setRegionId', _data.user.regionId)
              commit('setRegionQueryCode', _data.user.regionQueryCode)
              commit('setHasGetInfo', true)
              localStorage.setItem('userInfo', JSON.stringify(_data.user))
            }
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 退出登录
    handleLogOut({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        http.get({
          api: apis.logout,
          param: {
            userCode: state.userCode
          }
        }).then(() => {
          removeCookies('token');
          removeCookies('userCode');
          removeCookies('name');
          removeCookies('loginMode');
          removeCookies('regionId');
          removeCookies('regionQueryCode');
          removeCookies('orgId');
          removeCookies('orgName');
          removeCookies('orgQueryCode');
          removeCookies('userType');
          removeCookies("categoryId");
          removeCookies("personId");
          //存储本地
          localStorage.setItem("userAuthority", '');
          localStorage.setItem("token", '');
          localStorage.setItem("userInfo", '');
          //跳转到成功页面
          removeCookies('user');
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        try {
          http.post({
            api: apis.getUserInfo + '?token=' + getCookies('token')
          }).then(res => {
            if (res.code === 200) {
              commit('setToken', getCookies('token'))
              commit('setUserName', getCookies('username'))
              commit('setUserId', getCookies('userid'))
              commit('setUserType', getCookies('usertype'))
              commit('setUserCode', getCookies('usercode'))
              commit('setOrgId', getCookies('orgid'))
              commit('setOrgName', getCookies('orgname'))
              commit('setOrgQueryCode', getCookies('regionquerycode'))
              commit('setRegionId', getCookies('regionid'))
              commit('setRegionQueryCode', getCookies('regionquerycode'))
              commit('setHasGetInfo', true)
            } else if (res.code === 12000 || res.code === 500) {
              this.$message({
                type: 'success',
                message: res.message
              })
            }
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取菜单列表
    getMenusList({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        try {
          http.get({
            api: apis.getAuthorMenu,
            param: {
              userCode: state.userCode
            }
          }).then(res => {
            if (res.code === 200) {
              res.data.forEach(item => {
                if (item.children && item.children.length > 0) {
                  item.children.forEach(subItem => {
                    if (subItem.children && subItem.children.length > 0) {
                      item.checkLevel = 3
                    } else {
                      item.checkLevel = 2
                    }
                  })
                } else {
                  item.checkLevel = 1
                }
              })
              commit('setMenuList', res.data)
            }
            resolve(res.code)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
