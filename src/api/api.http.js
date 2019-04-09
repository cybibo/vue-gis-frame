/**
 * Created by chenyb on 19/10/18.
 * http配置
 */
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import config from './config'
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.user.token) {
      config.headers.Authorization = `${store.state.user.token}`
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.dispatch('handleLogOut').then(() => {
            router.replace({
              path: 'login',
              query: { redirect: router.currentRoute.fullPath }
            })
          })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response)
  });

export default class http {
  async get(params) {
    try {
      let res = await axios.get(params.api, { params: params.param || {} }, config)
      return new Promise((resolve, reject) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      alert('服务器出错')
      console.log(err)
    }
  }
  async post(params) {
    try {
      let res = await axios.post(params.api, params.param || {}, config)
      return new Promise((resolve, reject) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  async delete(params) {
    try {
      let res = await axios.delete(params.api, { params: params.param || {} }, config)
      return new Promise((resolve, reject) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      // return (e.message)
      alert('服务器出错')
      console.log(err)
    }
  }
  async put(params) {
    try {
      let res = await axios.put(params.api, { params: params.param || {} }, config)
      return new Promise((resolve, reject) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      // return (e.message)
      alert('服务器出错')
      console.log(err)
    }
  }
};
