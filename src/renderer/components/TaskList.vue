<template>
  <div class="list">
    <div class="list-header">
        <h2>{{list.name}}</h2>
    </div>
    <div class="list-tasks">
        <template v-for="task in list.tasks">
          <task-card  v-bind:task="task" @open-editor="openEditor"></task-card>
        </template>
    </div>
    <button v-on:click="addNewTask">Add Task</button>
    <button v-on:click="removeList">Remove</button>
  </div>
</template>

<script>
  import TaskCard from './TaskCard'
  import EventBus from './../event-bus'

  export default{
    name: 'task-list',
    components: { TaskCard },
    props: [
      'list'
    ],
    methods: {
      openEditor: function (task) {
        this.$emit('open-editor', task)
      },
      addNewTask: function () {
        this.$emit('add-new-task', this.list)
      },
      removeList: function () {
        if (confirm('Remove task?')) {
          EventBus.$emit('remove-list', this.list)
        }
      }
    }
  }
</script>

<style>
.list{
  display: inline-block;
  vertical-align: top;
  width: 300px;
  background-color: #DDDDDD;
  margin: 6px;
  padding: 6px;
}

.list-header{
  color: #AAAAAA;
}

.list-tasks{
}
</style>
