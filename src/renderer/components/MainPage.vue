<template>
  <div class="main-page">
    <board></board>
    <task-editor/>
  </div>
</template>

<script>
  import TaskEditor from './TaskEditor'
  import Board from './Board'
  import DepTree from './DepTree'
  export default{
    name: 'main-page',
    components: { Board, TaskEditor, DepTree },
    methods: {
    },
    data: function () {
      return {
        board: {
          name: 'board',
          lists: []
        }
      }
    },
    watch: {
    }
  }
</script>

<style>
  .main-page{
    position: absolute;
    color: #DDDDDD;
    top: 0;
    height: 100vh;
  }
</style>
