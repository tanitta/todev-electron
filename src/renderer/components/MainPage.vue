<template>
  <div class="main-page">
    <task-editor/>
    <board></board>
    <dep-tree></dep-tree>
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
    color: #DDDDDD;
  }
</style>
