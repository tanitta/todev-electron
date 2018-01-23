<template>
  <div>
    <template v-for="depId in depIds">
      <div>
        {{depName(depId)}}
        <el-button type="danger" size="mini" icon="el-icon-delete" v-on:click="removeDep(depId)"></el-button>
      </div>             
    </template>
    <el-select
      v-model="depId"
      filterable
      remote
      reserve-keyword
      placeholder="Please enter a keyword"
      :remote-method="remoteMethod"
      :loading="loading">
      <el-option
        v-for="item in options4"
        :key="item.id"
        :label="item.label"
        :value="item.id">
      </el-option>
    </el-select>

    <el-button type="default" size="mini" icon="el-icon-plus" v-on:click="addNewDep"></el-button>
  </div>
</template>

<script>
  export default {
    name: 'dep-selector',
    props: [
      'type',
      'event-bus',
      'allTaskIds',
      'dep-ids-init',
      'self-task-id'
    ],
    data: function () {
      return {
        options4: [],
        taskDic: [],
        depIds: [],
        depId: '',
        loading: false
      }
    },
    mounted: function () {
      this.taskDic = []
      for (var taskId of this.allTaskIds) {
        let item = {id: taskId, label: this.$store.getters.task(taskId).name}
        Array.prototype.push.apply(this.taskDic, item)
      }
      this.depIds = this.depIdsInit
      // this.depIds = [{value: 0, key: 'hoge'}]
    },
    updated: function () {
      this.eventBus.$emit('setDepsToTask', this.depIds)
    },
    methods: {
      depName: function (id) {
        let filtered = this.taskDic.filter(task => task.id === id)
        let name = ''
        if (filtered.length > 0) {
          name = filtered[0].label
        }
        return name
      },
      removeDep: function (id) {
        this.depIds = this.depIds.filter(depId => depId !== id)

        let depTargetTask = this.taskFromId(id)
        if (this.type === 'prev') {
          depTargetTask.nexts = depTargetTask.nexts.filter(depId => depId !== this.selfTaskId)
        }
        if (this.type === 'next') {
          depTargetTask.prevs = depTargetTask.prevs.filter(depId => depId !== this.selfTaskId)
        }
      },
      addNewDep: function () {
        if (this.depId.length === 0) { return }
        this.depIds.push(this.depId)
        let depTargetTask = this.taskFromId(this.depId)
        if (this.type === 'prev') {
          depTargetTask.nexts.push(this.selfTaskId)
        }
        if (this.type === 'next') {
          depTargetTask.prevs.push(this.selfTaskId)
        }

        this.depId = ''
      },
      remoteMethod: function (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.options4 = this.taskDic.filter(item => {
              return item.label
                .indexOf(query) > -1
            }).filter(item => {
              return this.depIds.indexOf(item.id) === -1
            }).filter(item => {
              return this.selfTaskId !== item.id
            })
          }, 200)
        } else {
          this.options4 = []
        }
      },
      taskFromId: function (id) {
        let tasks = []
        for (var l of this.taskDics) {
          Array.prototype.push.apply(tasks, l.tasks)
        }
        let tasksMatchedToId = tasks.filter(task => { return task.id === id })
        console.assert(tasksMatchedToId.length === 1)
        return tasksMatchedToId[0]
      }

    }
  }
</script>

<style>
</style>
