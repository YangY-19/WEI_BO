<template>
   <div class="personal-center" @scroll.passive="getScroll($event)">
       <div class="personal-center-box" ref="personalcenterbox" >
          <Nav/>
          <header>
             <div class="personal-info">
                 <img :src="userInfo.picture" />
                 <div class="nickName mt5 mb5">
                     <span class="mr5">{{userInfo.nickName}}</span>
                     <div class="man-icon" v-if="userInfo.gender == '1'"><a-icon type="man" /></div>
                     <div class="woman-icon" v-if="userInfo.gender == '2'"><a-icon type="woman" /></div>
                 </div>
                 <div class="introduce" v-if="userInfo.introduce">{{userInfo.introduce}}<router-link :to="{path: '/setting',query: {key: 1}}" class="ml5 blue"><a-icon type="edit" /></router-link></div>
                 <div class="introduce" v-else>一句话介绍一下自己吧，让别人更了解你 <router-link :to="{path: '/setting',query: {key: 1}}" class="ml5 blue"><a-icon type="edit" /></router-link></div>
                 <div v-if="!userInfo.isMe" @click="handleFollowed">
                   <a-button v-if="userInfo.amFollowed" class="follow-btn">取消关注</a-button>
                   <a-button v-else class="follow-btn">关注</a-button>
                 </div>
             </div>
             
          </header>
     <div class="personal-center-nav">
        <p v-for="item in pcnav" :key="item.key" @click="handelNav(item.key)" :class="{ 'border-b': item.key === onpcnav}"> {{item.title}}</p>
    </div>
    <div class="personal-center-body">
        <!-- 个人主页 -->
       <div class="weibo-list" v-if="onpcnav === 'homepage'">
         <div class="list-box">
           <div class="weibo-item" v-for="(item, index) in weiboList" :key="item.id">
               <div class="item-info">
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
                      <Icon type="ios-arrow-down" class="fontsize22" />
                      <transition name="down">
                        <ul class="down-content" v-if="downcontent">
                         <li>取消关注</li>
                         <li>屏蔽此条围脖</li>
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
                    <div v-if="item.contentHeigth > 66">
                        <div class="ta-c main-color pointer" v-if="item.contentflag" @click="readMore(item.contentflag, index)">
                            展开更多{{item.clientHeight}}<Icon type="ios-arrow-down" class="fontsize22" />
                        </div>
                        <div class="ta-c main-color pointer" v-else @click="readMore(item.contentflag, index)">
                            收回<Icon type="ios-arrow-up" class="fontsize22" />
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
         </div>
         <div class="load-more" >
             <a-icon  v-if="scrollFlag" type="loading" />
             <p v-else>{{scrollFlagtext}}</p>
        </div>
       </div>

       <!-- 粉丝 -->
       <div v-if="onpcnav === 'fans'">
           <div class="fans-list" v-if="fansList.fansList.length > 0">
               <div class="fans-item" v-for="item in fansList.fansList" :key="item.id">
                   <div class="fans-item-l">
                     <img :src="item && item.picture">
                   <div class="name-info" @click="fansGoUser(item.id)">
                       <div class="name">
                          <span class="bold">{{item.nickName}}</span>
                          <span class="ml5"><a-icon type="crown" class="main-color" /></span>
                         <div class="man-icon ml5" v-if="item.gender == '1'"><a-icon type="man" /></div>
                         <div class="woman-icon ml5" v-if="item.gender == '2'"><a-icon type="woman" /></div>
                       </div>
                       
                       <div class="info">
                        <div>
                            <p>关注</p>
                            <p class="main-color ml5">{{item.condition.followerCount}}</p>
                        </div>
                        <div class="wire">
                            <p >粉丝</p>
                            <p class="main-color ml5">{{item.condition.fansCount}}</p>
                        </div>
                        <div>
                            <p >围脖</p>
                            <p class="main-color ml5">{{item.condition.weiboCount}}</p>
                        </div>
                      </div>
                      <div class="add">
                         <p>地址: <span>{{item.city}}</span></p>
                         <p>简介: <span> {{item.introduce}}</span></p>
                         
                      </div>
                   </div>
                   </div>
                   <div class="fans-item-r" v-if="!item.isMyFans">
                     互相关注
                   </div>
               </div>
           </div>
           <div class="fans-list-0" v-else>暂无粉丝</div>
       </div>

       <!-- 关注的人 -->
       <div v-if="onpcnav === 'follower'">
          <div class="fans-list" v-if="followList.followList.length > 0" >
               <div class="fans-item"  v-for="(item, index) in followList.followList" :key="item.user.id">
                   <div class="fans-item-l">
                     <img :src="item.user && item.user.picture">
                   <div class="name-info" @click="fansGoUser(item.user.id)">
                       <div class="name">
                          <span class="bold">{{item.user.nickName}}</span>
                          <span class="ml5"><a-icon type="crown" class="main-color" /></span>
                         <div class="man-icon ml5" v-if="item.user.gender == '1'"><a-icon type="man" /></div>
                         <div class="woman-icon ml5" v-if="item.user.gender == '2'"><a-icon type="woman" /></div>
                       </div>
                       
                       <div class="info">
                        <div>
                            <p>关注</p>
                            <p class="main-color ml5">{{item.condition.followerCount}}</p>
                        </div>
                        <div class="wire">
                            <p >粉丝</p>
                            <p class="main-color ml5">{{item.condition.fansCount}}</p>
                        </div>
                        <div>
                            <p >围脖</p>
                            <p class="main-color ml5">{{item.condition.weiboCount}}</p>
                        </div>
                      </div>
                      <div class="add">
                         <p>地址: <span>{{item.user.city}}</span></p>
                         <p>简介: <span> {{item.user.introduce}}</span></p>
                         
                      </div>
                   </div>
                   </div>
                   <div class="fans-item-r" @click="cancelFans(item.user.id, index)">
                     取消关注
                   </div>
               </div>
           </div>
          <div class="fans-list-0" v-else>暂无关注人</div>
       </div>

       <!-- 左侧信息 -->
       <div class="weibo-user-info">
         <div class="user">
           <div class="user-info">
             <div class="info">
              <div @click="handelNav('homepage')">
                  <p class="fontsize18 bold">{{userInfo.weiboCount}}</p>
                  <p class="info-text">围脖</p>
              </div>
              <div class="wire" @click="handelNav('fans')">
                  <p class="fontsize18 bold">{{userInfo.fansCount}}</p>
                  <p class="info-text">粉丝</p>
              </div>
               <div @click="handelNav('follower')">
                  <p class="fontsize18 bold">{{userInfo.followerCount}}</p>
                  <p class="info-text">关注</p>
              </div>
             </div>
           </div>
         </div>
       </div>
        </div>
    </div>
   </div>
</template>

<script>
import Nav from '../../components/nav'
import moment from 'moment'
import scrollMixin from '../../mixin/scroll-mixin'
import 'moment/locale/zh-cn'
export default {
    name:'personal',
    data() {
        return {
             weiboList: [],
             moment,
             pcnav: [{key:'homepage',title:'我的主页'},{key:'fans',title:'粉丝'},{key:'follower',title:'关注的人'}],
             onpcnav: 'homepage',
             downcontent: false,
            scrollBottom: 100,
            scrollFlag: false,
            scrollFlagtext: '',
            pageIndex: 0,
            userInfo: {},
            fansList: [],
            followList: [],
        }
    },

    mixins: [scrollMixin],

    // created() {
    //     this._getUserInfo()
    // },
    
    activated() {
       let userId = parseInt(this.$route.params.id)
      
       this._getUserInfo(userId)
    },
    // mounted() {
    //   window.addEventListener('mousewheel',this.handleScroll,false)
    // },

  methods: {
      _getUserInfo(userId) {
        this.onpcnav = this.$route.query.onpcnav || 'homepage'
        this.$api.users.getuserInfo({
          userId: userId
        }).then(res => {
          if(res.data.code) {
            this.userInfo = res.data.data
          }
        })
        
        this.$api.blogs.profile({
          userId: userId
        }).then(res => {
            this._result(res)
        })

        this.$api.userRelation.getFans({
          userId: userId,
          pageIndex: 0
        }).then(res => {
          const result = res.data
          if (result.code === 10000) {
             this.fansList = result.data
          }
        })

        this.$api.userRelation.getFollow({
          userId: userId,
          pageIndex: 0
        }).then(res => {
          const result = res.data
          if (result.code === 10000) {
             this.followList = result.data
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
                        this.weiboList = result.data.blogList
                    }
                this.scrollFlagtext = result.data.count < result.data.pageSize  ? '已经到底!' :  ''
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
                    this.pageIndex ++
                })
            } else {
                this.$message.error(result.message)
            }
    },
  //关注的人 /粉丝-> 她的主页
    fansGoUser(userId) {
      this.fansList = [],
      this.followList = [],
      this._getUserInfo(userId)
    },

   //关注的人 -> 取消关注
    cancelFans(userId, index) {
      const followList = this.followList.followList
      followList.splice(index, 1)
      this.followList.followList = followList
       this.$api.userRelation.unFollow({
            userId: userId
        }).then(res => {
            const result = res.data
            if (result.code === 10000) {
              this.$Message.success(result.data)
            } else {
              this.$Message.error(result.message)
            }
        })
    },

    //头部信息 -> 关注/取消关注
    handleFollowed() {
      if (this.userInfo.amFollowed) {
         this.$api.userRelation.unFollow({
            userId: this.userInfo.id
        }).then(res => {
            const result = res.data
            if (result.code === 10000) {
              this.$Message.success(result.data)
            } else {
              this.$Message.error(result.message)
              this.userInfo.amFollowed = !this.userInfo.amFollowed
            }
        })
      } else {
        this.$api.userRelation.follow({
            userId: this.userInfo.id
        }).then(res => {
            const result = res.data
            if (result.code === 10000) {
              this.$Message.success(result.data)
            } else {
               this.$Message.error(result.message)
               this.userInfo.amFollowed = !this.userInfo.amFollowed
            }
        })
    }
       this.userInfo.amFollowed = !this.userInfo.amFollowed
    },
    //查看更多
    readMore(flag, index) {
        this.weiboList[index].contentflag = !flag
    },

    // //切换nav
    handleScroll(e) {
        if (this.scrollBottom === 0 && this.scrollFlag) {
            this.scrollFlag = false
            this.$api.blogs.loadMore({
                userId: this.$route.query.userId,
                pageIndex: this.pageIndex
            }).then(res => {
                if (!res.data.data.isEmpty) {
                    this._result(res, 'push')
                    setTimeout(() => {
                        this.scrollFlag = true
                        this.scrollBottom = 100
                        this.scrollFlagtext = ''
                    },2000)
                }  else {
                    this.scrollFlagtext = '已经到底!'
                }
            })
        } else {  
            this.scrollFlag = false
        }
    },

    // getScroll(event) {
    //   // 滚动条距离底部的距离scrollBottom
    //   let scrollBottom = event.target.scrollHeight -  event.target.scrollTop - event.target.clientHeight;
    //   if (scrollBottom === 0) this.scrollFlag = true
    //   this.scrollBottom = scrollBottom
    // },

    
  handelNav(key) {
     this.onpcnav = key
  },
  },
   components: {
       Nav
   }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/index.scss'; 
.personal-center{
    position: fixed;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url('../../assets/images/gr-bg.jpg') no-repeat;
    background-size: cover;
    overflow-y: auto
    
}
.personal-info{
          padding: 90px 0 60px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img{
              width: 105px;
              height: 105px;
              margin: 10px 0px;
              border-radius: 50%
          }
          .nickName{
              font-size: 22px;
              color: #f2f2f5;
              display: flex;
              .man-icon{
                 width: 20px;
                 height: 20px;
                 font-size: 14px;
                 border-radius: 50%;
                 background: #4ebdf9;
                 display: flex;
                 justify-content: center;
                 align-items: center;
             }
             .woman-icon{
                 width: 20px;
                 height: 20px;
                 font-size: 14px;
                 border-radius: 50%;
                 background: #f94ed4;
                 display: flex;
                 justify-content: center;
                 align-items: center;
             }
          }
          .introduce{
             line-height:40px;
             font-size: 16px;
             color: #f2f2f5;
          }
        }
 .personal-center-nav{
     width:980px;
     margin: 10px auto;
     height: 40px;
     color: #333;
     background: #ffffff;
     display: flex;
     justify-content: space-around;
     align-items: flex-end;
     p {
         width: 100px;
         height: 30px;
         line-height: 30px;
         text-align: center;
     }
     .border-b {
        font-weight: bold;
        border-bottom: 2px solid $mainColor;
     }
 }
 .personal-center-body {
        width: 1000px;
        padding: 0px 10px 10px 10px;
        min-height: 600px;
        margin: 0px auto;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        
     .weibo-list{
      width: 720px;
      .list-box{
        .weibo-item{
          margin-bottom: 10px;
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
       background: #ffffff;
       .user-info{
           height: 50%;
          padding: 20px 0 10px 0;
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

  //粉丝
  .fans-list{
    .fans-item{
       width: 720px;
       display: flex;
       justify-content: space-between;
       background: #fff;
       margin-bottom: 10px;
      .fans-item-l {
        display: flex;
        padding: 10px 20px;
      
      }
         img {
           width: 50px;
           height: 50px;
           border-radius:50%;
         }
         .name-info{
           .name{
             display: flex;
             margin-left: 10px;
             .man-icon{
                 width: 20px;
                 height: 20px;
                 font-size: 14px;
                 border-radius: 50%;
                 color: #fff;
                 background: #4ebdf9;
                 display: flex;
                 justify-content: center;
                 align-items: center;
             }
             .woman-icon{
                 width: 20px;
                 height: 20px;
                 color: #fff;
                 font-size: 14px;
                 border-radius: 50%;
                 background: #f94ed4;
                 display: flex;
                 justify-content: center;
                 align-items: center;
             }
           }
        .info{
          height: 30px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          div{
            width: 77px;
            display: flex;
            justify-content:center;
            align-items: center;
            font-size: 14px;
          }
        }
        .add{
          margin-left: 10px;
          font-size: 14px;
          p{
            line-height: 24px;
          }
        }
         }
         .fans-item-r {
           width: 100px;
           height: 30px;
           text-align: center;
           line-height: 30px;
           background:  $mainColor;
           color: #fff;
           border-radius: 4px;
           margin: 20px;
         }
     }
   }
   .fans-list-0 {
     background: #f2f2f5;
     width:  720px;
     line-height: 30px;
     text-align: center;
   }
 }
 .load-more{
     width: 720px;
     font-size: 16px;
     height: 30px;
     line-height: 30px;
     text-align: center;
     background: #fff;
     margin: 0 auto;
 }
 .follow-btn{
   background: $mainColor;
   color: #fff;
   margin-top: 10px;
   border: none;
   :hover {
     background: $mainColor;
     color: #333;
   }
 }
</style>