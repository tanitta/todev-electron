<template>
  <div class="list-container">
    <div class="list-body">
      <div class="list-header">
        <h2>{{list}}</h2>
      </div>
      <div class="list-content">
        <div class="list-tasks">
        </div>
        <el-button type="danger" size="mini" icon="el-icon-delete" v-on:click="removeList"></el-button>
        <el-button type="default" size="mini" icon="el-icon-plus" v-on:click="addNewTask"></el-button>
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
        this.$store.getters.tasks({})
      },
      list: function () {
        this.$store.getters.list(this.listId)
      }
    },
    methods: {
      openEditor: function (task) {
        this.$emit('open-editor', task)
      },
      addNewTask: function () {
        this.$emit('add-new-task', this.list)
      },
      removeList: function () {
        if (confirm('Remove task?')) {
          this.$store.commit('removeList', { id: this.listId })
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
