<template>
  <div>
    <template v-for="depId in depIds">
      <div>
        {{depName(depId)}}
        <button v-on:click="removeDep(depId)">Remove</button>
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
    <button v-on:click="addNewDep">Add</button>
  </div>
</template>

<script>
  export default {
    name: 'dep-selector',
    props: [
      'type',
      'event-bus',
      'lists',
      'dep-ids-init',
      'self-task-id'
    ],
    data: function () {
      return {
        options4: [],
        depIds: [],
        depId: '',
        list: [],
        loading: false
      }
    },
    mounted: function () {
      this.list = []
      for (var l of this.lists) {
        let list = l.tasks.map(task => {
          return {id: task.id, label: task.name}
        })
        Array.prototype.push.apply(this.list, list)
      }
      this.depIds = this.depIdsInit
      // this.depIds = [{value: 0, key: 'hoge'}]
    },
    updated: function () {
      this.eventBus.$emit('setDepsToTask', this.depIds)
    },
    methods: {
      depName: function (id) {
        let filtered = this.list.filter(task => task.id === id)
        let name = ''
        if (filtered.length > 0) {
          name = filtered[0].label
        }
        return name
      },
      removeDep: function (id) {
        this.depIds = this.depIds.filter(depId => depId !== id)
      },
      addNewDep: function () {
        if (this.depId.length === 0) { return }
        this.depIds.push(this.depId)
        this.depId = ''
      },
      remoteMethod: function (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.options4 = this.list.filter(item => {
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
      }
    }
  }
</script>

<style>
</style>
