<template>
  <div>
    <div class="dep-list">
      <template v-for="item in depIds">
        <div class="dep-container">
          <div class="item1" v-on:click="moveTask(item)">
            {{depName(item)}}
          </div>
          <div class="item2">
            <el-button type="danger" size="mini" icon="el-icon-delete" v-on:click="removeDep(item)"></el-button>
          </div>
        </div>             
      </template>
    </div>
    <el-select
      size="mini"
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
  import EventBus from './../event-bus'

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
        this.taskDic = [...this.taskDic, item]
      }
      this.depIds = this.depIdsInit
    },
    updated: function () {
    },
    computed: {
    },
    methods: {
      moveTask: function (taskId) {
        EventBus.$emit('close-task-editor')
        EventBus.$emit('open-task-editor', { taskId: taskId })
      },
      depName: function (id) {
        let task = this.$store.getters.task(id)
        let name = task.name
        return name
      },
      removeDep: function (id) {
        this.depIds = this.depIds.filter(depId => depId !== id)
        this.eventBus.$emit('removeDepsToTask', id)
      },
      addNewDep: function () {
        if (this.depId.length === 0) { return }
        this.eventBus.$emit('addDepsToTask', this.depId)
        this.depIds.push(this.depId)
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
        return this.$store.getters.task(id)
      }

    }
  }
</script>

<style>
  .dep-container {
    margin-top: 2px;
    margin-bottom: 2px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-direction: row;
  }
  .dep-list{
  }
</style>
