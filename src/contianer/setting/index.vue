<template>
  <div>
    <Nav />
    <a-collapse accordion :defaultActiveKey="defaultActiveKey">
      <a-collapse-panel header="退出登录" key="0">
        <a-button type="primary" class="logout" @click="logout">
          退出登录
        </a-button>
      </a-collapse-panel>
      <a-collapse-panel header="基本信息" key="1">
        <div class="basic-setting">
          <a-form :form="form" @submit="handleSubmit">
            <a-form-item
              label="昵称"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input v-decorator="['nickName']" placeholder="请输入昵称!" />
            </a-form-item>
            <a-form-item
              label="所在城市"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'city']"
                @focus="toAddress(true)"
                placeholder="请选择所在城市!"
              />
              <div
                class="mask"
                @click.stop="toAddress(false)"
                v-if="mask"
              ></div>
              <div class="distpicker" v-if="addInp">
                <v-distpicker type="mobile" @selected="selected" />>
              </div>
            </a-form-item>

            <a-form-item
              label="介绍"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'introduce'
                ]"
                placeholder="一句话介绍自己!"
              />
            </a-form-item>

            <a-form-item
              label="头像"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
            >
              <div class="clearfix">
                <a-upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  :fileList="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传头像</div>
                  </div>
                </a-upload>
                <a-modal
                  :visible="previewVisible"
                  :footer="null"
                  @cancel="handleCancel"
                >
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 12, offset: 5 }" class="ta-c">
              <!-- <a-button type="primary" class="btn" html-type="submit" >
            提交
          </a-button> -->
              <a-button type="primary" class="btn" html-type="submit">
                修改
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-collapse-panel>
      <!-- 修改密码 -->
      <a-collapse-panel header="修改密码" key="2">
        <Modification />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import Nav from "../../components/nav";
import VDistpicker from "v-distpicker";
import Modification from "./modification-psd";
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      city: "请选择",
      addInp: false,
      mask: false,
      //上传
      previewVisible: false,
      previewImage: "",
      fileList: [],
      defaultActiveKey: this.$route.query.key
    };
  },
  mounted() {
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      
      this.form.validateFields((err, values) => {
        if (!err) {
           let pictureInfo = {}
          if (this.fileList.length > 0) {
            const { thumbUrl, name, size } = this.fileList[0];
             pictureInfo = {
              thumbUrl,
              name,
              size
            };
          }
          this.$api.users
            .changeInfo({
              nickName: values.nickName,
              introduce: values.introduce,
              city: values.city,
              pictureInfo
            })
            .then(res => {
              const result = res.data;
              if (result.code === 10000) {
                this.$Message.success(result.data);
                this.fileList = [];
                this.form.resetFields();
              } else {
                this.$Message.error(result.message);
              }
            });
        }
      });
    },

    _logout() {
      this.$api.users.logout().then(res => {
            if (res.data.code === 10000) {
              this.$router.push({ path: "/" });
            }
        });
    },

    logout() {
      const _this = this
      this.$confirm({
        title: "确认退出登录吗？",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          _this._logout()
        }
      });
    },

    // 省市区三级联动
    toAddress(falg) {
      this.addInp = falg;
      this.mask = falg;
    },

    selected(data) {
      this.form.setFieldsValue({
        city:
          data.province.value + " " + data.city.value + " " + data.area.value
      });
      this.addInp = false;
      this.mask = false;
    },

    //上传
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      console.log(file);
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    }
  },

  watch: {
    $route: function (to, from) {
         debugger
      }
  },

  components: {
    Nav,
    VDistpicker,
    Modification
  }
};
</script>

<style lang="scss" scoped>
.logout{
  width: 200px;
  margin-left: 100px
}
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.474);
  z-index: 9999999999999999999999;
}
.distpicker {
  position: absolute;
  width: 100%;
  height: 600px;
  overflow-y: auto;
  z-index: 99999999999999999999999;
  .address-container {
    padding-left: 15px;
  }
}

.basic-setting {
  width: 60%;
  margin: 30px auto;
}
.modification-password {
  width: 60%;
  margin: 30px auto;
}
</style>
