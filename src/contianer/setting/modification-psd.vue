<template>
  <a-form :form="form" @submit="handleSubmit" class="register-form">
    <!-- 当前密码 -->
    <a-form-item 
           label="原密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
      <a-input
        class="register-input"
        v-decorator="['curpassword',{
            rules: [
              {
                required: true,
                message: '请输入正确格式密码！'
              }
            ]
          }]"
        placeholder="请输人当前密码!"
      >
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>

    <!-- 密码 -->
    <a-form-item
          label="新密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
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
        placeholder="请输人新密码!"
      >
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>

    <!-- 确认密码 -->
    <a-form-item
          label="确认密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
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
        placeholder="请再次输人新密码!"
      >
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>

    <a-form-item class="ta-c">
      <a-button type="primary" class="btn" html-type="submit">
        修改
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  data() {
    return {
      confirmDirty: false,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$api.users.changePassword({
             password: values.curpassword,
             newPassword: values.password
          }).then(res => {
            const result = res.data
             if (result.code === 10000) {
               this.$Message.success(result.data)
               this.form.resetFields();
             }else {
               this.$Message.error(result.message)
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
      if (value && value === form.getFieldValue("curpassword")) {
        callback("新密码和旧密码不能重复！");
      }
      callback();
    },

  },

};
</script>

<style lang="scss" scoped>
.register-form {
    
//   padding: 30px 0 0 0;
//   .register-btn {
//     background: #ffdb63;
//     color: #ffffff;
//     width: 100%;
//     height: 54px;
//     font-size: 20px;
//     border: none;
//   }
//   .register-input {
//     height: 45px;
//     font-size: 18px;
//     &::placeholder {
//       font-size: 18px;
//     }
//   }
//   .mb0 {
//     margin-bottom: 5px !important;
//   }
//   .verification-code {
//     display: flex;
//     justify-content: space-between;
//     .verification-input {
//       width: 60%;
//     }
//     .verification-img {
//       width: 36%;
//       img {
//         width: 100%;
//         height: 45px;
//       }
//     }
//   }
}
</style>


