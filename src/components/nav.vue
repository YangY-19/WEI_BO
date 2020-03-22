<template>
  <div class="nav-mall">
    <div class="navigation-bars">
      <div class="nav-box">
        <div class="logo-box">
          <img src="../assets/images/logopng.png" alt="" />
        </div>
        <a-input-search
          class="search-input"
          placeholder="大家都在搜：毛不易新歌43分钟"
        />
        <!-- @search="onSearch" -->
        <router-link tag="div" :to="{path: '/home', query:{userId: userInfo.id}}" class="pointer-nav">
          <a-icon type="home" />
          首页
        </router-link>
        <router-link tag="div" :to="{name: 'personalCenter', params:{id: userInfo.id }}" class="pointer-nav">
          <a-icon type="compass" />
          我的空间
        </router-link>
        <router-link tag="div" :to="{path: '/square'}" class="pointer-nav">
          <a-icon type="usergroup-add" />
          广场
        </router-link>
        <router-link tag="div" to="/setting" class="pointer-nav">
          <a-icon type="setting" />
          设置
        </router-link>
        <div class="user-info" v-if="isLogin">
          <div class="pointer-nav">
             <a-icon type="user" />
             <span class="ml10">{{ userInfo.nickName }}</span>
          </div>
          <div class="wire"></div>
          <a-icon type="mail" class="pointer-nav"/>
          <router-link tag="div" class="form-icon pointer-nav" :to="{path: '/home', query:{userId: userInfo.id}}">
            <a-icon type="form" />
          </router-link>
         
        </div>
        <div class="user-info1" v-else>
          <router-link
            tag="p"
            :to="{ path: '/login', query: { islogin: 'register' } }"
            class="pointer-nav"
            >注册</router-link
          >
          <div class="wire"></div>
          <router-link tag="p" to="/login" class="pointer-nav"
            >登录</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  data() {
    return {
      isLogin: false,
      userInfo: {}
    };
  },

  mounted() {
      this. _verifyLogin() 

  },

  methods: {
       _verifyLogin() {
       this.$api.users.verifyLogin().then(res=> {
           const result = res.data
           if(result.code === 10000) {
             this.isLogin = result.data.isLogin
             this.userInfo = result.data
             if (!result.data.isLogin) {
               this.$router.push({path: '/'})
             }
           }
       })
    },
  },

  watch: {
    isLogin() {
       this._verifyLogin()
    },
    $route: {
    handler: function(val, oldVal){
      // debugger
      // if (oldVal.path === '/') {
      //   this.$router.push({path: '/home', query:{userId: this.userInfo.id}})
      // }
    },
    // 深度观察监听
    deep: true
  }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/index.scss'; 
.router-link-exact-active {
  color: $mainColor;
}
.nav-mall {
  height: 60px;
}
.pointer-nav {
  cursor: pointer;
  &:hover {
    color: $mainColor;
  }
}
.logout{
  height:30px;
  background: $mainColor;
  line-height: 30px;
  border: none
}
.navigation-bars {
  position: fixed;
  width: 100%;
  height: 60px;
  padding: 10px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #f9f9f9;
  border-top: 2px solid $mainColor;
  background: #ffffff;
  z-index: 2;
  .nav-box {
    position: fixed;
    width: 1320px;
    min-width: 1000px;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;
    line-height: 40px;
    .logo-box {
      img {
        height: 40px;
      }
    }
    .search-input {
      height: 30px;
      width: 35%;
      display: flex;
      align-self: center;
      margin-left: -20px;
      margin-right: 9%;
    }
    .user-info{
       width: 220px;
       display: flex;
       justify-content: space-between;
       align-items: center;
       .wire{
         width: 1px;
         height: 25px;
         background: #d9d9d9
       }
       .form-icon{
         width: 24px;
         height: 24px;
         background: $mainColor;
         display: flex;
         justify-content: center;
         align-items: center;
         border-radius: 2px;
         color: #ffffff;
         font-weight: 500
       }
     }
    .user-info1 {
      width: 120px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .wire {
        width: 1px;
        height: 25px;
        background: #d9d9d9;
      }
    }
  }
}
</style>
