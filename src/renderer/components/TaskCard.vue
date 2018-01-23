<template>
  <div class="card" v-on:click="onClick">
    <div class="card-header">
      {{task.name}}
    </div>
    <div class="card-content">
    </div>
  </div>
</template>

<script>
  import EventBus from './../event-bus'
  export default {
    name: 'task-card',
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
        this.openEditor()
      },
      openEditor: function () {
        EventBus.$emit('open-task-editor', { taskId: this.taskId })
      }
    }
  }
</script>

<style>
.card{
  margin-bottom: 6px;
  background-color: #FAFAFA;
}

.card:hover{
  margin-bottom: 6px;
  background-color: rgba(235,235,235,1);
}

.card-header{
  color: #AAAAAA;
  padding: 6px;
}
</style>
