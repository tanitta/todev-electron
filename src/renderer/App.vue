<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'todev',
    props: {
      selectedTasks: {}
    }
  }
</script>

<style>
  /* CSS */
  #app {
    -webkit-app-region: drag;
    -webkit-user-select: none;
    margin:0;padding:0;
    height: 100vh;
    overflow: hidden;
    background-color: #FAFAFA;
  }
</style>
