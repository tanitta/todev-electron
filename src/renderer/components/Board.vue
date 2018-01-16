<template>
  <div class="board">
    <h1>BoardName</h1>
    <div class="lists">
      <template v-for="list in lists">
        <task-list v-bind:list="list" @open-editor="openEditor" @add-new-task="addNewTask"></task-list>
      </template>
      <el-button type="default" size="mini" icon="el-icon-plus" v-on:click="addNewList"></el-button>
    </div>
  </div>
</div>
</template>

<script>
  import TaskList from './TaskList'
  import EventBus from './../event-bus'
  import FileSystem from 'fs'
  import Mkdirp from 'mkdirp'
  import Path from 'path'

  export default{
    name: 'board',
    components: { TaskList },
    methods: {
      openEditor: function (task, editorOption) {
        this.selectedTasks = [task]
        // this.editorOption = editorOption
        let payload = {
          selectedTasks: [task]
        }
        if (editorOption) {
          payload.isFocus = editorOption.isFocus
        }
        payload.lists = this.lists
        EventBus.$emit('open-task-editor', payload)
      },
      addNewTask: function (list) {
        let date = new Date()
        let newTask = {name: 'new task', description: '', id: date.getTime(), prevs: [], nexts: []}
        list.tasks.push(newTask)
        this.openEditor(newTask, {isFocus: true})
      },
      addNewList: function () {
        let date = new Date()
        let newList = {name: 'new list', tasks: [], id: date.getTime()}
        this.lists.push(newList)
      },
      removeTask: function (task, list) {
        task.prevs.map(depTaskId => {
          let depTask = this.depTaskFromId(depTaskId)
          depTask.nexts = depTask.nexts.filter(dt => dt !== task.id)
        })
        task.nexts.map(depTaskId => {
          let depTask = this.depTaskFromId(depTaskId)
          depTask.prevs = depTask.prevs.filter(dt => dt !== task.id)
        })
        if (list) {
          let targetList = this.lists.filter(l => l.id === list.id)
          targetList.tasks = targetList.tasks.filter(t => t.id !== task.id)
        } else {
          for (var listIndex in this.lists) {
            this.lists[listIndex].tasks = this.lists[listIndex].tasks.filter(t => t.id !== task.id)
          }
        }
      },
      depTaskFromId: function (id) {
        let tasksMatchedToId = this.tasks().filter(task => { return task.id === id })
        console.assert(tasksMatchedToId.length === 1)
        return tasksMatchedToId[0]
      },
      tasks: function () {
        let tasks = []
        for (var l of this.lists) {
          Array.prototype.push.apply(tasks, l.tasks)
        }
        return tasks
      },
      removeList: function (list) {
        this.lists = this.lists.filter(l => l.id !== list.id)
      },
      saveLists: function () {
        let jsonString = JSON.stringify(this.lists)
        let listsFilePath = process.cwd() + '/.todev/lists.json'
        FileSystem.writeFileSync(listsFilePath, jsonString)
      },
      loadLists: function () {
        function check (filePath) {
          try {
            FileSystem.statSync(filePath)
            return true
          } catch (err) {
            return false
          }
        }
        let listsFilePath = process.cwd() + '/.todev/lists.json'
        if (!check(listsFilePath)) {
          Mkdirp.sync(Path.dirname(listsFilePath))
          FileSystem.writeFileSync(listsFilePath, '[]')
        }
        let jsonString = FileSystem.readFileSync(listsFilePath, 'utf8')
        this.lists = JSON.parse(jsonString)
      }
    },
    data: function () {
      return {
        showEditor: false,
        editorOption: {},
        selectedTasks: [],
        lists: [
          {
            id: 0,
            name: 'List1',
            tasks: [
              {name: 'Wash dishes', description: 'many many dishes', id: 1}
            ]
          },
          {
            id: 1,
            name: 'List2',
            tasks: [
            ]
          }
        ]
      }
    },
    watch: {
      lists: {
        handler: function (val, oldVal) {
          this.saveLists()
        },
        deep: true
      }
    },
    mounted: function () {
      this.loadLists()
      EventBus.$on('remove-task', this.removeTask)
      EventBus.$on('remove-list', this.removeList)
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
body { font-family: 'Source Sans Pro', sans-serif; }

.board{
  margin: 48px;

}
.lists{
  user-select: none;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  padding-right: 56px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
