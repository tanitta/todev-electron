<template>
  <div class="main">
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
    name: 'main',
    components: { Board, TaskEditor, DepTree },
    methods: {
    }
  }
</script>

<style>
  .main{
    color: #DDDDDD;
  }
</style>
