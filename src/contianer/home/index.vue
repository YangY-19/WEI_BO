<template>
  <div class="home-mail">
    <Nav/>
    <div class="home">
       <div class="weibo-list">
         <div class="issue">
           <img src="../../assets/images/title.png" >
           <div class="textarea">
             <a-textarea :autosize="false" v-model="textareadata" :rows="4"/>
           </div>
           <div class="submlit-box">
             <div class="v-emojin">
             <div class="emojin">
                <div @click="handleEmojin"><a-icon type="smile" class="main-color fontsize20"/><p class="ml5">表情</p></div>
                <a-badge :count="fileList.length" :offset="[10,0]">
                    <div @click="handleUploadImg"><a-icon type="picture" class="main-color fontsize20" /><p  class="ml5">图片</p></div>
               </a-badge>
                <div><a-icon type="thunderbolt" class="main-color fontsize20"/><p  class="ml5">头条文章</p></div>
                <div class="adderss" @click="handleAddress">
                  <a-icon type="bank" class="main-color fontsize20 bold"/>
                  <a-tooltip placement="topLeft" :title="addressdata">
                      <p  class="ml5 addresas-data">{{addressdata}}</p>
                 </a-tooltip></div>         
             </div>
           </div>
           <a-button class="main-bg white btn" @click="submit">发送</a-button>
           </div>
           <VEmojiPicker class="v-emoji-picker" @select="selectEmoji" v-if="emojin" style="width:100%"/>
            <Xmap @address="getAddress" v-if="address"/>
            <div class="upload-img" v-if="uploadImg">
              <div class="clearfix">
                <a-upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  :fileList="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 9">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传图片</div>
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
            </div>
         </div>
        <div>
        </div>
         <div class="list-box">
           <!-- 个人主页 -->
           <div class="weibo-item" @click="hanldedownContentShow(index, item.downcontent)" v-for="(item, index) in weiboList" :key="item.id">
               <div class="item-info" >
                   <div class="info-box">
                     <img :src="item.user && item.user.picture" />
                     <div class="name-date">
                        <div class="name">{{item.user.nickName}} <span><a-icon type="crown" class="main-color" /></span></div>
                        <div class="date">
                            {{(moment(item.createdAt).fromNow().indexOf('分钟前') > -1 || moment(item.createdAt).fromNow().indexOf('秒前') > -1) 
                            ?  moment(item.createdAt).fromNow() 
                            :
                             moment(item.createdAt).calendar()}} 
                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 来自 {{item.city}}</div>
                     </div>
                   </div>
                    <div class="down-box">
                        <!-- @click="hanldedownContent"  -->
                        <a-icon type="down" @click.stop="hanldedownContent(index, item.downcontent)" class="fontsize18"/>
                      <transition name="down">
                        <ul class="down-content" v-if="item.downcontent">
                         <li @click="unFollow(item.userId, index)">取消关注</li>
                         <li @click="shieldItem(index)">屏蔽此条围脖</li>
                         <li>帮上头条</li>
                       </ul>
                      </transition>
                    </div>
               </div>

               <div class="item-content">
                    <div class="content-box">
                      <div class="content"  :ref="`content${index}`" :class="[ item.contentflag ? 'line-3' : '']">
                        {{item.content}}
                      </div>
                    <div v-if="item.contentHeigth > 66" class="mt5">
                        <div class="ta-c main-color pointer" v-if="item.contentflag" @click="readMore(item.contentflag, index)">
                            展开更多
                        </div>
                        <div class="ta-c main-color pointer" v-else @click="readMore(item.contentflag, index)">
                            收回
                        </div>
                    </div>
                    <div class="img-box" v-if="item.images">
                      <div class="img" v-for="(imgItem, index) in item.images" :key="index" >
                        <img :src="imgItem" />
                      </div>
                    </div>
                    </div>
                    <div class="operation">
                        <div class="collect"><span><a-icon type="star" /> 收藏</span></div>
                        <div class="wire"><a-icon class="mr5" type="message"/> 30</div>
                        <div><a-icon class="mr5" type="like"/> 100</div>
                    </div>
               </div>
           </div>
            <div class="load-more" >
                <p @click="loadMore">{{scrollFlagtext}}</p>
            </div>
         </div>
    </div>
       <!-- //用户信息 -->
       <div class="weibo-user-info">
         <div class="user">
           <div class="user-bg">
             <img :src="userInfo.picture" alt="">
           </div>
           <div class="user-portrait">
              <img :src="userInfo.picture" alt="">
           </div>
           <div class="user-info">
             <div class="name">
               <router-link tag='span' :to="{name: 'personalCenter', params: {id: userInfo.id}, query:{onpcnav:'homepage'}}" class="bold mr2 pointer hover ">{{userInfo.nickName}} </router-link> <span><a-icon type="crown" class="main-color" /></span>
             </div>
             <div class="info">
               <router-link tag='div' :to="{name: 'personalCenter', params: {id: userInfo.id}, query:{onpcnav:'follower'}}">
                  <p class="fontsize18 bold">{{userInfo.followerCount}}</p>
                  <p class="info-text">关注</p>
              </router-link>
              <router-link class="wire" tag='div' :to="{name: 'personalCenter', params: {id: userInfo.id}, query:{onpcnav:'fans'}}">
                  <p class="fontsize18 bold">{{userInfo.fansCount}}</p>
                  <p class="info-text">粉丝</p>
              </router-link>
              <router-link tag='div' :to="{name: 'personalCenter', params: {id: userInfo.id}, query:{onpcnav:'homepage'}}">
                  <p class="fontsize18 bold">{{userInfo.weiboCount}}</p>
                  <p class="info-text">围脖</p>
              </router-link>
             </div>
           </div>
         </div>
       </div>
  </div>
  </div>
</template>

<script>
import Nav from '../../components/nav'
import Xmap from '../../components/city'
import Square from '../square/index'
import VEmojiPicker from 'v-emoji-picker';
import moment from "moment";
import scrollMixin from "../../mixin/scroll-mixin";
import "moment/locale/zh-cn";

export default {
  name: 'Home',
  data() {
    return{
       appCodeName: navigator.appCodeName,
       textareadata: '',
       emojin: false,
       emojindata: '',
       address: false,
       addressdata: '选择地址',
       uploadImg: false,
        //上传
      previewVisible: false,
      previewImage: "",
      fileList: [],
      falg: true,
      userInfo: {},
      isLogin: false,
      weiboCount: 0,
      weiboList: [],
      moment,
      pageIndex: 0,
      scrollFlagtext: '加载更多!'
    }
  },
  mixins: [scrollMixin],

  activated() {
      this._getuserInfo()
      this.$api.blogs.getHomeBlogList().then(res => {
        this._result(res);
      });
  },

  methods: {
    _getuserInfo() {
      let query = this.$route.query
      this.$api.users.getuserInfo({
        userId: query.userId
      }).then(res => {
         if(res.data.code === 10000) {
           this.userInfo = res.data.data
         }
      })
      this.$api.blogs.profile({
          userName: query.userId
        }).then(res => {
              if (res.data.code === 10000) {
                this.weiboCount = res.data.data.count
              }
          })
    },
//围脖列表返回结果格式化
    _result(res, push) {
         const result = res.data
            if (result.code === 10000) {
                result.data.blogList.forEach(item => {
                    if (item.images) {
                        item.images = item.images.split(",")
                    }
                    item.contentflag = false
                    item.createdAt= moment(item.createdAt).format().substring(0, 19)
                })
                if (push === 'push') {
                        let a = this.weiboList
                        let b = a.concat(result.data.blogList)
                        this.weiboList = b
                    } else {
                       result.data.blogList.forEach(item => {
                          item.downcontent = false
                        })
                        this.weiboList = result.data.blogList
                    }
                this.scrollFlagtext = result.data.count < result.data.pageSize  ? '已经到底!' :  '加载更多!'
                this.$nextTick(() => { 
                    let refs = this.$refs
                    let index = 0
                    let weiboList = this.weiboList
                    for (let key in refs) {
                         if (key.includes('content')) {
                            let clientflag = refs[key][0].clientHeight > 66 ? true : false
                            weiboList[index].contentflag = clientflag
                            weiboList[index].contentHeigth = refs[key][0].clientHeight
                            index++
                         }
                    }
                    
                    this.weiboList = weiboList
                    console.log(weiboList)
                    this.pageIndex ++
                })
            } else {
                this.$message.error(result.message)
            }
    },
 //更多操作
    hanldedownContent(index,falg) {
        this.weiboList[index].downcontent = !falg
    },
    hanldedownContentShow(index,falg) {
      if (falg) {

        this.weiboList[index].downcontent = !falg
      }
    },
    //取消关注
    unFollow(userId, index) {
      this.$api.userRelation.unFollow({
         userId
      }).then(res => {
        if(res.data.code === 10000) {
            this.weiboList.splice(index, 1)
        }
      })
    },

    //屏蔽
    shieldItem(index) {
      debugger
       this.weiboList.splice(index, 1)
    },

     handleEmojin() {
      if (!this.emojin && (this.uploadImg || this.address)) {
        this.address = false
        this.uploadImg = false
      }
      this.emojin = !this.emojin
    },
    handleAddress() {
      if (!this.address && (this.uploadImg || this.emojin)) {
        this.emojin = false
        this.uploadImg = false
      }
      this.address = !this.address
    },
    handleUploadImg() {
       if (!this.uploadImg && (this.address || this.emojin)) {
        this.emojin = false
        this.address = false
      }
      this.uploadImg = !this.uploadImg
    },

    getAddress(e) {
       this.addressdata = e
    },
    selectEmoji(emoji) {
      console.log(emoji)
      this.textareadata = this.textareadata + emoji.data
      console.log(this.textareadata)
    },

    
    //上传
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    },
    
    //发布
    submit() {
      if (this.addressdata === '选择地址') {
        return this.$Message.info('请选择地址!')
      }
      debugger
      if (!this.textareadata && this.fileList == []) {
        return this.$Message.info('请输入类容!')
      }
      if (this.fileList && !this.textareadata) {
        this.textareadata = '分享图片'
      }
      this.$api.blogs.createBlog({
         content: this.textareadata, 
         imageList: this.fileList, 
         city: this.addressdata
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.data)
           this._getuserInfo()
           this.fileList = []
           this.textareadata = '',
           this.emojin = false,
           this.address = false,
           this.uploadImg = false,
           this.addressdata = '选择地址'
        } else {
           this.$Message.error(res.data.message)
        }
      })
    },
    //查看更多
    readMore(falg, index) {
       this.weiboList[index].contentflag = !falg
    },

    loadMore() {
      debugger
        this.$api.blogs
          .homeBlogLoadMore({
            pageIndex: this.pageIndex
          })
          .then(res => {
            if (!res.data.data.isEmpty) {
              this._result(res, "push");
            } else {
              this.scrollFlagtext = "已经到底!";
            }
          });
    }

  },

  components: {
    Nav,
    VEmojiPicker,
    Xmap
  }
}
</script>

<style  lang="scss" scoped>
@import '../../assets/styles/index.scss'; 
.home-mail{
   position: fixed;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url('../../assets/images/gr-bg.jpg') no-repeat;
    background-size: cover;
    overflow-y: auto
}
.home{
  width: 1000px;
  padding: 20px 10px 10px 10px;
  min-height: 600px;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.278);
  .weibo-list{
      width: 720px;
      .issue{
        width: 100%;
        background: #ffffff;
        img {
          margin: 10px;
          width: 208px;
          height: 20px;
        }
        .textarea{
          padding: 0 10px;
          box-sizing: border-box
        }
        .submlit-box{
          padding: 10px;
          display: flex;
          justify-content: space-between;
          .v-emojin{
            width: 66%;
            .emojin{
              display: flex;
              height: 30px;
              justify-content: space-between;
              align-items: center;
              div{
                display: flex;
                p{
                  margin-top: 2px;
                }
                .addresas-data{
                  width:180px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }
        .upload-img{
          width:100%;
          background: #f2f2f2;
          padding: 10px;
          
        }
      }


      .list-box{
        .weibo-item{
          margin-top: 10px;
          background: #ffffff;
          .item-info{
            height: 77px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;  
              .info-box{
                  height: 55px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  img{
                    width: 55px;
                    height: 55px;
                    border-radius: 50%
                  }
                  .name-date{
                      height: 50px;
                      margin-left: 10px;
                      display: flex;
                      flex-direction: column;
                      justify-content: space-around;
                      
                      .name{
                        font-weight: bold;
                      }
                      .date{
                        font-size: 14px;
                        color: #808080
                      }
                  }
            }
            .fontsize22{
              &:hover{
                color: $mainColor;
              }
            }
            .down-box{
              position: relative;
              .down-content{
                width: 140px;
                line-height: 26px;
                background: #ffffff;
                border: 1px solid #e1e1e4;
                border-radius: 6px;
                position: absolute;
                right: 20px;
                top: 20px;
                li {
                  padding:6px 10px;
                  &:hover{
                    background: #e1e1e4
                  }
                }
              }
            }
          }

          .item-content{
            .content-box{
              padding: 0 27px 10px 75px;
              font-size: 15px;
             .content{
               width: 100%;
               color: #333;
               line-height: 22px;
               
               .h-66{
                 max-height: 66px
               }
               .h-auto {
                 height: auto
               }
             }
             .line-3 {
                 overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
               }
             .img-box{
                 width: 598px;
                 display:flex;
                  flex-wrap: wrap;
                 justify-content: space-between; 
               .img {
                 width: 32%;
                 margin-top: 10px;
                 img {
                   width: 100%
                 }
               }
             }
            }
             .operation{
               height: 40px;
               display: flex;
               justify-content: space-around;
               align-items: center;
               border-top: 1px solid #f2f2f5;
               color: #808080;
               div{
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

  .weibo-user-info{
     width: 250px;
     .user{
       width:100%;
       height: 190px;
       background: #ffffff;
       position: relative;
       .user-bg{
          height: 50%;
          img{
            width: 100%;
            width: 100%;
            height: 100%;
          }
       }
       .user-portrait{
         width:66px;
         height: 66px;
         border-radius:50px;
         position: absolute;
         top: 40%;
         left: 50%;
         margin-left: -33px;
         margin-top: -33px;
         img{
            width:66px;
            height: 66px;
            border-radius:50px;
         }
       }
       .user-info{
           height: 50%;
          padding: 20px 0 10px 0;
          .name {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 11px;
            margin-top: 3px;
          }
          .info{
            height: 50%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            div{
              width: 82px;
              display: flex;
              justify-content:center;
              flex-direction: column;
              align-items: center;
              .info-text{
                margin-top: 2px;
                margin-left: 3px;
                font-size: 12px;
              }
            }
          }
       }
     }
  }
}

 .dowm-enter, .dowm-leave-to {
      opacity: 0
    }
    .dowm-leave, .dowm-enter-to {
      opacity: 1
    }
    .dowm-enter-active, .dowm-leave-active {
      transition: all 2s
    }

    .map{
      width: 600px;
      height: 600px;
    }
    .load-more {
  width: 100%;
  font-size: 16px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #fff;
  margin: 10px auto;
}
</style>