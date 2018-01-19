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
    height: 100%;
    overflow: hidden;
    background-color: #FAFAFA;
  }
</style>
