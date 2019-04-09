<!--  登录页面 -->
<template>
  <div class="login">
    <div class="welcome">Welcome</div>
    <!-- 用户信息 -->
    <div class="login-box">
        <login-form @on-success-valid="handleSubmit"></login-form>
    </div>
    <div class="company"></div>
  </div>
</template>

<script>
import http from '@/api/http'
import apis from '@/api'
import loginForm from '_c/login-form'
import { mapMutations, mapActions } from 'vuex'
import store from '@/store'
export default {
  components: {
    loginForm
  },
  methods: {
    ...mapMutations([
      'setToken'
    ]),
    ...mapActions([
      'handleLogin',
      'getSystemInfo',
      'getMenusList'
    ]),
    handleSubmit (data) {
      this.handleLogin(data).then(res => {
        if(res.code === 200 ) {
          let systemInfo = this.getSystemInfo()
          let menusList = this.getMenusList()
          Promise.all([systemInfo, menusList]).then(result => {
            if(result[0] === 200 && result[1] === 200) {
              this.$router.push({
              name: this.$config.homeName
              })
            }
          })
        }else {
          this.$message({
           type:'error',
           message:res.message
         })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    position: relative;
    background-image: url('/static/images/login/bg.png');
    background-size: cover;
    background-position: center;
    color: #fff;
    .welcome {
      position: absolute;
      top: 38px;
      right: 38px;
      font-size: 36px;
      text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.36);
    }
    .company {
      position: absolute;
      bottom: 28px;
      left: 50%;
      width: 264px;
      height: 44px;
      margin-left: -132px;
      background: url('/static/images/login/company.png');
      background-size: 100% 100%;
    }
    .login-box {
      position: absolute;
      top: 30%;
      left: 50%;
      width: 541px;
      height: 487px;
      margin-left: -270.5px;
      background: url('/static/images/login/login_box.svg');
    }
  }
</style>
