<template>
  <el-select
    v-model="value9"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="Please enter a keyword"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in options4"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'dep-selector',
    props: [
      'event-bus',
      'deps',
      'lists'
    ],
    data: function () {
      return {
        options4: [],
        value9: [],
        list: [],
        loading: false
      }
    },
    created: function () {
      this.list = []
      for (var l of this.lists) {
        let list = l.tasks.map(task => {
          return {value: task.name, label: task.name}
        })
        Array.prototype.push.apply(this.list, list)
      }
    },
    methods: {
      remoteMethod: function (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.options4 = this.list.filter(item => {
              return item.label
                .indexOf(query) > -1
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
