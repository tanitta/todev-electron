<template>
  <div class="list-container">
    <div class="list-body">
      <div class="list-header">
        <h2>{{list.name}}</h2>
      </div>
      <div class="list-content">
        <div class="list-tasks">
          <template v-for="taskId in taskIds">
            <task-card  :taskId="taskId"></task-card>
          </template>
        </div>
        <el-button type="danger" size="mini" icon="el-icon-delete" v-on:click="removeList"></el-button>
        <el-button type="default" size="mini" icon="el-icon-plus" v-on:click="addTask"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import TaskCard from './TaskCard'

  export default{
    name: 'task-list',
    components: { TaskCard },
    props: [
      'listId'
    ],
    mounted: function () {
    },
    computed: {
      tasks: function () {
        return this.$store.getters.tasks({})
      },
      list: function () {
        return this.$store.getters.list(this.listId)
      },
      taskIds: function () {
        return this.$store.getters.taskIds(this.listId)
      }
    },
    methods: {
      openEditor: function (taskId) {
        this.$emit('open-editor', taskId)
      },
      addTask: function () {
        let taskId = (new Date()).getTime().toString()
        this.$store.commit('addTask', { taskId: taskId, listId: this.listId })
      },
      removeList: function () {
        if (confirm('Remove task?')) {
          this.$store.dispatch('removeList', { listId: this.listId })
        }
      }
    }
  }
</script>

<style>
.list-container{
  display: inline-block;
  vertical-align: top;
  width: 300px;
  height: 100%;
  margin-left: 6px;
  margin-right: 6px;
}
.list-body{
  max-height: 100%;
  box-sizing: border-box;
  padding: 6px;
  background-color: #DDDDDD;
  display:flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  position: relative;
  white-space: normal;
}

.list-header{
  color: #AAAAAA;
}

.list-tasks{
}

.list-content{
  background-color: #DDDDDD;
  height: 100%;
  overflow: auto;
}
</style>
