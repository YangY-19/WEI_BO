<template>
  <div class="square" @scroll.passive="getScroll($event)">
    <div class="square-box" ref="personalcenterbox">
      <Nav />
      <div class="square-body">
        <!-- 个人主页 -->
        <div class="weibo-list">
          <div class="list-box">
            <div
              class="weibo-item"
              v-for="(item, index) in weiboList"
              :key="item.id"
            >
              <router-link
                tag="div"
                :to="{ name: 'personalCenter', params: {id: item.userId}}"
                class="item-info"
              >
                <div class="info-box">
                  <img :src="item.user && item.user.picture" />
                  <div class="name-date">
                    <div class="name">
                      {{ item.user.nickName }}
                      <span><a-icon type="crown" class="main-color"/></span>
                    </div>
                    <div class="date">
                      {{
                        moment(item.createdAt).fromNow() .indexOf("分钟前") > -1 ||
                        moment(item.createdAt).fromNow().indexOf("秒前") > -1
                          ? moment(item.createdAt).fromNow()
                          : moment(item.createdAt).calendar()
                      }}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 来自
                      {{ item.city }}
                    </div>
                  </div>
                </div>
                <div class="down-box" v-if="isShowDowm" @click.stop="follerUser(item.userId, index)">
                  <div class="down-box2" v-if="item && !item.myIsfollower">
                  <div class="attention">
                    关注 <a-icon type="plus" class="fontsize14" />
                  </div>
                  </div>
                </div>
              </router-link>

              <div class="item-content">
                <div class="content-box">
                  <div
                    class="content"
                    :ref="`content${index}`"
                    :class="[item.contentflag ? 'line-3' : '']"
                  >
                    {{ item.content }}
                  </div>
                  <div v-if="item.contentHeigth > 66">
                    <div
                      class="ta-c main-color pointer"
                      v-if="item.contentflag"
                      @click="readMore(item.contentflag, index)"
                    >
                      展开更多{{ item.clientHeight
                      }}<Icon type="ios-arrow-down" class="fontsize22" />
                    </div>
                    <div
                      class="ta-c main-color pointer"
                      v-else
                      @click="readMore(item.contentflag, index)"
                    >
                      收回<Icon type="ios-arrow-up" class="fontsize22" />
                    </div>
                  </div>
                  <div class="img-box" v-if="item.images">
                    <div
                      class="img"
                      v-for="(imgItem, index) in item.images"
                      :key="index"
                    >
                      <img :src="imgItem" />
                    </div>
                  </div>
                </div>
                <div class="operation">
                  <div class="collect">
                    <span><a-icon type="star" /> 收藏</span>
                  </div>
                  <div class="wire">
                    <a-icon class="mr5" type="message" /> 30
                  </div>
                  <div><a-icon class="mr5" type="like" /> 100</div>
                </div>
              </div>
            </div>
          </div>
          <div class="load-more">
            <a-icon v-if="scrollFlag" type="loading" />
            <p v-else>{{ scrollFlagtext }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/nav";
import moment from "moment";
import scrollMixin from "../../mixin/scroll-mixin";
import "moment/locale/zh-cn";
export default {
  data() {
    return {
      weiboList: [],
      moment,
      downcontent: false,
      scrollBottom: 100,
      scrollFlag: false,
      scrollFlagtext: "",
      pageIndex: 0,
      isShowDowm: false
    };
  },

  mixins: [scrollMixin],

  activated() {
    this.isShowDowm = this.$route.path === "/" ? false : true;
    this.$api.blogs.square().then(res => {
      this._result(res);
    });
  },

  methods: {
    //围脖列表格式化
    _result(res, push) {
      const result = res.data;
      if (result.code === 10000) {
        result.data.blogList.forEach(item => {
          if (item.images) {
            item.images = item.images.split(",");
          }
          item.contentflag = false;
          item.createdAt = moment(item.createdAt)
            .format()
            .substring(0, 19);
        });
        if (push === "push") {
          let a = this.weiboList;
          let b = a.concat(result.data.blogList);
          this.weiboList = b;
        } else {
          this.weiboList = result.data.blogList;
        }

        this.$nextTick(() => {
          let refs = this.$refs;
          let index = 0;
          let weiboList = this.weiboList;
          for (let key in refs) {
            if (key.includes("content")) {
              let clientflag = refs[key][0].clientHeight > 66 ? true : false;
              weiboList[index].contentflag = clientflag;
              weiboList[index].contentHeigth = refs[key][0].clientHeight;
              index++;
            }
          }
          this.weiboList = weiboList;
          this.pageIndex++;
          console.log(weiboList);
        });
      } else {
        this.$message.error(result.message);
      }
    },

    //关注
    follerUser(userId, index) {
       this.$api.userRelation.follow({
            userId
        }).then(res => {
            const result = res.data
            if (result.code === 10000) {
              const weiboItem = this.weiboList
              this.weiboList[index].myIsfollower = !weiboItem[index].myIsfollower
              this.$api.blogs.square().then(res => {
                this._result(res);
              });
              this.$Message.success(result.data)
            } else {
               this.$Message.error(result.message)
            }
        })
    },
    //查看更多
    readMore(flag, index) {
      this.weiboList[index].contentflag = !flag;
    },

    handleScroll(e) {
      if (this.scrollBottom === 0 && this.scrollFlag) {
        this.scrollFlag = false;
        this.$api.blogs
          .squareLoadMore({
            pageIndex: this.pageIndex
          })
          .then(res => {
            if (!res.data.data.isEmpty) {
              this._result(res, "push");
              setTimeout(() => {
                this.scrollFlag = true;
                this.scrollBottom = 100;
                this.scrollFlagtext = "";
              }, 2000);
            } else {
              this.scrollFlagtext = "已经到底!";
            }
          });
      } else {
        this.scrollFlag = false;
      }
    }
  },



  components: {
    Nav
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/index.scss";
.square {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: url("../../assets/images/gr-bg.jpg") no-repeat;
  background-size: cover;
  overflow-y: auto;
}

.square-body {
  width: 1000px;
  padding: 0px 10px 10px 10px;
  min-height: 600px;
  margin: 30px auto 0;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;

  .weibo-list {
    width: 1000px;
    .list-box {
      .weibo-item {
        margin-bottom: 10px;
        background: #ffffff;
        .item-info {
          height: 77px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .info-box {
            height: 55px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            img {
              width: 55px;
              height: 55px;
              border-radius: 50%;
            }
            .name-date {
              height: 50px;
              margin-left: 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;

              .name {
                font-weight: bold;
              }
              .date {
                font-size: 14px;
                color: #808080;
              }
            }
          }
          .fontsize22 {
            &:hover {
              color: $mainColor;
            }
          }
          .down-box {
            .down-box2 {
                 width: 60px;
               height: 25px;
                font-size: 14px;
                border-radius: 4px;
                border: 1px solid #ccc;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            :hover {
              color: $mainColor;
            }
          }
        }

        .item-content {
          .content-box {
            padding: 0 27px 10px 75px;
            font-size: 15px;
            .content {
              width: 100%;
              color: #333;
              line-height: 22px;

              .h-66 {
                max-height: 66px;
              }
              .h-auto {
                height: auto;
              }
            }
            .line-3 {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            }
            .img-box {
              width: 598px;
              display: flex;
              flex-wrap: wrap;
              .img {
                width: 32%;
                height: 200px;
                margin-top: 10px;
                margin-left: 7px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          .operation {
            height: 40px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            border-top: 1px solid #f2f2f5;
            color: #808080;
            div {
              width: 232px;
              height: 22px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
.load-more {
  width: 1000px;
  font-size: 16px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #fff;
  margin: 0 auto;
}
</style>
