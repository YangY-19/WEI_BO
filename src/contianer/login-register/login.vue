<template>
  <div class="login">
    <div class="masking">
      <div class="login-info-box">
        <img src="../../assets/images/handle.png" alt />
        <transition name='login'>
            <div class="login-info">
          <!-- 密码登录 -->
          <div class="login-info-left">
            <p class="fontsize30">{{loginAndregister === 'login' ? '登录' : '注册'}}账号</p>
            <a-form v-if="loginAndregister === 'login'" layout="horizontal" :form="form" @submit="handleSubmit" class="login-form">
              <a-form-item 
                :validate-status="userNameError() ? 'error' : ''"
                :help="userNameError() || ''"
              >
                <a-input
                  class="login-input"
                  style="heigth:45px"
                  v-decorator="[
                    'userName',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输人用户名!'
                        }
                      ]
                    }
                  ]"
                  placeholder="请输人用户名"
                >
                  <a-icon
                    slot="prefix"
                    type="user"
                    style="color:rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-item>
              <a-form-item
                :validate-status="passwordError() ? 'error' : ''"
                :help="passwordError() || ''"
              >
                <a-input
                class="login-input"
                  v-decorator="[
                    'password',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输人正确密码!'
                        }
                      ]
                    }
                  ]"
                  type="password"
                  placeholder='请输人用密码!'
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    style="color:rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button
                  class="login-btn"
                  type="primary"
                  html-type="submit"
                  :disabled="hasErrors(form.getFieldsError())"
                  >{{loginAndregister === 'login' ? "立即登录" : "立即注册"}}</a-button
                >
              </a-form-item>
            </a-form>
            <Register v-else @isLogin="handleloginState"/>
          </div>

          <!-- 登录方式 -->
          <div class="login-info-right">
            <div class="contanner">
              <p>快捷登录</p>
              <div class="icon-box">
                <div class="iconqq">
                  <!-- <i class="iconfont">&#xe68b;</i> -->
                  <!-- <div class="icon-qq"></div> -->
                  <a-icon type="qq" class="fontsize30 mb10" />
                  <p>QQ</p>
                </div>
                <div class="iconwb">
                  <!-- <i class="iconfont">&#xe68b;</i> -->
                  <a-icon type="weibo" class="fontsize30 mb10" />
                  <p>微博</p>
                </div>
              </div>
              <div class="login-register">
                <div>
                  <p class="lineH20">{{loginAndregister === 'login' ? '没有该账号' : '已有该账号'}}!</p>
                  <p class="blue pointer" @click="handleloginState">
                    {{loginAndregister === 'login' ? '现在注册' : '现在登陆'}}
                    <span>
                      <Icon type="ios-return-right" class="fontsize14 bold" />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Register from './register'
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
export default {
  name: 'login',
  data() {
    return {
      loginshow: false,
      hasErrors,
      form: this.$form.createForm(this),
      loginAndregister: 'login',
      locals: '/'
    }
  },

  created() {
    debugger
    this._verifyLogin()
  },

  mounted() {
    if (this.$route.query.islogin) {
      this.loginAndregister = this.$route.query.islogin
    }
    this.$nextTick(() => {
      this.form.validateFields()
    })
  },

  methods: {
    _verifyLogin() {
       this.$api.users.verifyLogin().then(res=> {
           const result = res || res.data
           if(result.code === 10000) {
             this.loginshow = false
             if(!result.data.isLogin) return
             this.$Message.success({
                background: true,
                content: `${result.data.userName}, 你已经登录!`,
                duration: 2
             });
             debugger
             localStorage.setItem("isLogin", true);
             this.$router.push('/')
           } else {
              localStorage.setItem("isLogin", false);
           }
       })
    },
    
      handleloginState() {
          if(this.loginAndregister === 'login') {
              this.loginAndregister = 'register'
          } else {
             this.loginAndregister = 'login' 
          }
      },

    // Only show error after a field is touched.
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('userName') && getFieldError('userName')
    },
    // Only show error after a field is touched.
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form
     
      return isFieldTouched('password') && getFieldError('password')
    },
    handleSubmit(e) {
      e.preventDefault()
       let locals = this.locals
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$api.users.login({
             userName: values.userName,
             password: values.password
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success({
                    background: true,
                    content: '登录成功!',
                    duration: 3
                });
                debugger
                const data = res.data.data
                this.$router.push({path: '/home', query: {userId: data.id, userName: data.userName}})
            } else {
               this.$Message.error({
                    background: true,
                    content: res.data.message,
                    duration: 3
                });
            }
          })
        }
      })
    }
  },

  watch: {
    $route:{
      handler(to, from) {
        debugger
        this.locals = from.path
        if (to.path === '/login') {
          debugger
          // this._verifyLogin()
        }
      },
      // 深度观察监听
      deep: true
    }
  },

  components: {
      Register
  }
}
</script>

<style lang="scss" scoped>

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.login {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 10px solid #ffffff;
  background-image: url('../../assets/images/login-bg.png');
  .masking {
    width: 1145px;
    height: 100%;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    .login-info-box {
      width: 964px;
      min-height: 307px;
      img {
        width: 100%;
        min-height: 107px;
      }
      .login-info {
        width: 100%;
        min-height: 200px;
        display: flex;
        background-color: #fff;
        transform: all 1s linear;
        .login-info-left {
          width: 482px;
          min-height: 259px;
          padding: 46px 61px;
          .login-form {
            padding: 30px 0 0 0;
            .login-btn {
                background: #ffdb63;
                color: #ffffff;
                width: 100%;
                height: 54px;
                font-size: 20px;
                border: none
            }
            .login-input{
                height: 45px;
               font-size: 18px;
               &::placeholder {
                 font-size: 18px;  
               }
            }
          }
        }
        .login-info-right {
          width: 482px;
          min-height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          .contanner {
            p {
              text-align: center;
            }
            .icon-box {
              height: 100px;
              display: flex;
              justify-content: space-around;
              div {
                width: 68px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .iconfont {
                  text-align: center;
                  margin-bottom: 10px;
                }
              }
            }
          }
          .login-register {
            font-size: 14px;
          }
        }
      }
    }
  }
}

.login-enter, .login-leave-to {
   opacity: 0;
}

.login-enter-active, .login-leave-active {
    transform: all .8s ease
}
</style>
