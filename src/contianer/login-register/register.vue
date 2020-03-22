<template>
  <a-form :form="form" @submit="handleSubmit" class="register-form">
    <!-- 昵称 -->
    <a-form-item :validateStatus="nickNameValidata" :help="nickNameHelp">
      <a-input
        class="register-input"
        v-decorator="['nickname']"
        placeholder="请输人昵称!"
        @blur="validatorNickNameFun"
      >
        <a-icon slot="prefix" type="block" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <!-- 账号 -->
    <a-form-item :validateStatus="userNameValidata" :help="userNameHelp">
      <a-input
        class="register-input"
        v-decorator="['account']"
        placeholder="请输人手机号为账号!"
        @blur="validatorUserNameFun"
      >
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>

    <!-- 密码 -->
    <a-form-item>
      <a-input
        class="register-input"
        v-decorator="[
          'password',
          {
            rules: [
              {
                required: true,
                message: '请输入正确格式密码！'
              },
              {
                validator: validateToNextPassword
              }
            ]
          }
        ]"
        type="password"
        placeholder="请输人用密码!"
      >
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>

    <!-- 确认密码 -->
    <a-form-item>
      <a-input
        class="register-input"
        v-decorator="[
          'confirm',
          {
            rules: [
              {
                required: true,
                message: '请输入正确格式密码！'
              },
              {
                validator: compareToFirstPassword
              }
            ]
          }
        ]"
        type="password"
        placeholder="请输人用密码!"
        @blur="handleConfirmBlur"
      >
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>

    <!-- 性别 -->
    <a-form-item >
      <a-radio-group
        v-decorator="[
          'gender',
          {
            rules: [
              {
                required: true,
                message: '请选择性别！'
              }
            ]
          }
        ]"
      >
        <a-radio :value="1">男</a-radio>
        <a-radio :value="2">女</a-radio>
        <a-radio :value="3">保密</a-radio>
      </a-radio-group>
    </a-form-item>

    <!-- 验证码 -->
    <a-form-item class="mb0">
      <div class="verification-code">
        <div class="verification-input">
          <a-input 
           class="register-input"
            v-decorator="[
          'verification',
          {
            rules: [
              {
                required: true,
                message: '请输入正确格式密码！'
              },
            ]
          }
        ]"
           placeholder="请输人验证码!">
            <a-icon type="safety" slot="prefix" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </div>
        <div class="verification-img">
          <img src="../../assets/logo.png" alt="" />
        </div>
      </div>
    </a-form-item>

<!-- 《注册服务协议》！ -->
    <a-form-item class="mb0">
      <a-checkbox
        v-decorator="[
          'agreement',
          {
            rules: [
              {
                required: true,
                message: '请同意《注册服务协议》！'
              }
            ]
          },
          { valuePropName: 'checked' }
        ]"
        class="login-checkbox"
      >
        同意《注册服务协议》
      </a-checkbox>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" class="register-btn" html-type="submit">
        立即注册
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  data() {
    return {
      confirmDirty: false,
      autoCompleteResult: [],
      nickNameValidata: "success", //验证昵称是否重复的状态
      nickNameHelp: "",
      userNameValidata: "success", //验证用户名是否重复的状态
      userNameHelp: ""
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      debugger
      if (this.nickNameValidata !== "success") {
        this.nickNameValidata = "error";
         this.nickNameHelp = '请输入昵称!'
      }
      if (this.userNameValidata !== "success"){
        this.userNameValidata = "error";
         this.userNameHelp = '请输入用户名!'
      }
      let falg = (this.nickNameValidata === "success" && this.userNameValidata === "success") ? true : false
      this.form.validateFields((err, values) => {
        if (!err && falg) {
          let gender = parseInt(values.gender)
          this.$api.users.register({
            nickName: values.nickname, 
            userName: values.account, 
            password: values.password, 
            gender
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success({
                    background: true,
                    content: res.data.data,
                    duration: 3
                });
                this.$emit('isLogin')
            } else {
               this.$Message.success({
                    background: true,
                    content: res.data.message,
                    duration: 3
                });
            }
          })
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    //验证两次密码是否一样
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次输入的密码不一致");
      } else {
        callback();
      }
    },

    //验证密码
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      let reg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/
      if (!(reg.test(value))) {
        callback("密码为6~20位,至少包含一个英文字母");
      }
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },

    //验证昵称是否重复
    validatorNickNameFun(e) {
      const value = e.target.value;
      if (!value) {
        this.nickNameValidata = "error";
        this.nickNameHelp = "请输入昵称！";
      }  else {
         this. isExistFun(value, 'nickname')
      }
    },

   //验证用户名是否重复
    validatorUserNameFun(e) {
      const value = e.target.value;
      if (!value || !(/^1[3456789]\d{9}$/.test(value))) {
        this.userNameValidata = "error";
        this.userNameHelp = "请输人手机号为账号";
      }  else {
         this. isExistFun(value, 'username')
      }
    },

  //验证昵称/用户名是否重复
    isExistFun(value, key) {
      let params = {}
      if (key === 'nickname') {        
        params ={ nickName: value }   
      } else if(key === 'username') {
        params ={ userName: value }  
      }
      this.$api.users.isExist(params).then(res=> {
          if (key === 'nickname') {
            if (res.data.code !== 10000) {
              this.nickNameValidata = "warning";
              this.nickNameHelp = res.data.message;
            } else {
              this.nickNameValidata = "success";
              this.nickNameHelp = "";
            }   
          } else if (key === 'username') {
              if (res.data.code !== 10000) {
                this.userNameValidata = "warning";
                this.userNameHelp = res.data.message;
              } else {
                this.userNameValidata = "success";
                this.userNameHelp = "";
              }   
          } 
      })
    }
  },

};
</script>

<style lang="scss" scoped>
.register-form {
  padding: 30px 0 0 0;
  .register-btn {
    background: #ffdb63;
    color: #ffffff;
    width: 100%;
    height: 54px;
    font-size: 20px;
    border: none;
  }
  .register-input {
    height: 45px;
    font-size: 18px;
    &::placeholder {
      font-size: 18px;
    }
  }
  .mb0 {
    margin-bottom: 5px !important;
  }
  .verification-code {
    display: flex;
    justify-content: space-between;
    .verification-input {
      width: 60%;
    }
    .verification-img {
      width: 36%;
      img {
        width: 100%;
        height: 45px;
      }
    }
  }
}
</style>
