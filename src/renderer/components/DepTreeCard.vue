<template>
  <div  class="dep-tree-card" v-on:click="onClick">
    <div class="text-area">
      {{task.name}}
    </div>
  </div>
</template>

<script>
  import EventBus from './../event-bus'
  export default{
    name: 'dep-tree-card',
    props: [
      'taskId'
    ],
    computed: {
      task: function () {
        return this.$store.getters.task(this.taskId)
      }
    },
    methods: {
      onClick: function (event) {
        EventBus.$emit('open-task-editor', { taskId: this.taskId })
      }
    }
  }
</script>

<style>
  .dep-tree-card{
    background-color: rgba(240, 240, 240, 0.3);
  }
  .dep-tree-card:hover{
    background-color: rgba(240, 240, 240, 0.5);
  }
  .text-area {
    color: #AAAAAA;
    margin-left:100px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding:6px;
  }
</style>
