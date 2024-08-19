<template>
  <div id="app">
    <keep-alive>
      <router-view :key="$route.fullPath"/>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'App',
  created() {
    console.log('进来了111111')
    // localStorage.setItem('AccessTokenKey', 'sdaasdadfgyiuasdghasdkhjasdjklajdklakjl')
    // localStorage.setItem('RefreshTokenKey', 'sdsdsaddsadssdasdw2weawwa')
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  //background-color: antiquewhite;
}
</style>
