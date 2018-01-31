let addArchive = function (task) {
  task.isArchived = false
}

export default {
  version: '0.0.1',
  migrate: function (state) {
    Object.keys(state.tasks).map(key => state.tasks[key]).forEach(addArchive)
    state.version = this.version
    return state
  }
}
