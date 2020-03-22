<template>
   <div id="app">
     <transition name="app">
      <keep-alive :exclude='/login/'>
          <router-view></router-view>
      </keep-alive>
     </transition>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
  
  }
}
</script>

<style>
.app-fade-enter-active, .app-fade-leave-active {
  transition: opacity .8s ease;
}
.app-fade-enter, .app-fade-leave-to {
  opacity: 0;
}
</style>
