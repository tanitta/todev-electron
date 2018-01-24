<template>
  <div class="task-name" v-on:click="onClick">
    {{task.name}}
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
  .task-name {
    color: #AAAAAA;
    margin-left:100px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding:6px;
  }
</style>
