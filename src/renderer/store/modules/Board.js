import FileSystem from 'fs'
import Vue from 'vue'
import Path from 'path'
import Mkdirp from 'mkdirp'
import Migrators from '../helpers/migrators'
import Semver from 'semver'
import { remote } from 'electron'

let boardFilePath = Path.join(remote.app.getPath('userData'), 'board.json')

const state = {
  version: '0.0.0',
  name: 'BoardName',
  lists: {},
  tasks: {},
  deps: {}
}

const mutations = {
  addList (state, p) {
    let id = (new Date()).getTime().toString()
    state.lists = {
      ...state.lists,
      [id]: {
        name: 'NewList',
        taskIds: []
      }
    }
  },
  removeList (state, p) {
    Vue.delete(state.lists, p.listId)
  },
  addTask (state, p) {
    state.lists[p.listId].taskIds.push(p.taskId)
    state.tasks = {
      ...state.tasks,
      [p.taskId]: {
        name: 'NewTask',
        description: '',
        prevIds: [],
        nextIds: [],
        isArchived: false
      }
    }
  },
  removeTask (state, p) {
    for (let list of Object.keys(state.lists).map(key => state.lists[key])) {
      list.taskIds = list.taskIds.filter(id => id !== p.taskId)
    }
    Vue.delete(state.tasks, p.taskId)
  },
  changeTask (state, p) {
    let id = p.taskId
    let task = state.tasks[id]
    if (p.name) task.name = p.name
    if (p.description) task.description = p.description
    if (p.hasOwnProperty('isArchived')) task.isArchived = p.isArchived
  },
  changeDescription (state, p) {
    let id = p.taskId
    let task = state.tasks[id]
    task.description = p.description
  },
  addDep (state, p) {
    let prevTask = state.tasks[p.prev]
    let nextTask = state.tasks[p.next]
    let noExist = (prevTask.nextIds.indexOf(p.next) === -1) || (nextTask.prevIds.indexOf(p.prev) === -1)
    if (!noExist) return
    prevTask.nextIds.push(p.next)
    nextTask.prevIds.push(p.prev)
  },
  removeDep (state, p) {
    let prevTask = state.tasks[p.prev]
    let nextTask = state.tasks[p.next]
    prevTask.nextIds = prevTask.nextIds.filter(id => id !== p.next)
    nextTask.prevIds = nextTask.prevIds.filter(id => id !== p.prev)
  },
  moveTask (state, p) {
  },
  loadBoard (state) {
    function check (filePath) {
      try {
        FileSystem.statSync(filePath)
        return true
      } catch (err) {
        return false
      }
    }
    if (!check(boardFilePath)) {
      Mkdirp.sync(Path.dirname(boardFilePath))
      let board = {
        version: '0.0.0',
        name: 'BoardName',
        lists: {},
        tasks: {}
      }
      FileSystem.writeFileSync(boardFilePath, JSON.stringify(board))
    }
    let jsonString = FileSystem.readFileSync(boardFilePath, 'utf8')
    let board = JSON.parse(jsonString)
    state.version = board.version
    state.name = board.name
    state.lists = board.lists
    state.tasks = board.tasks
    state.deps = board.deps
    console.log(state)
  },
  saveBoard (state) {
    let jsonString = JSON.stringify(state, undefined, 2)
    FileSystem.writeFileSync(boardFilePath, jsonString)
  },
  mightMigrate (state) {
    let latestVersion = Migrators[Migrators.length - 1].version
    let isLatest = Semver.eq(state.version, latestVersion)
    if (isLatest) { return }

    let updatedVersionIndex = Migrators.findIndex((element, index, array) => { return Semver.gt(element.version, state.version) })
    console.log(updatedVersionIndex)
    if (updatedVersionIndex === -1) {
      updatedVersionIndex = 0
    }
    for (var currentMigratorIndex = updatedVersionIndex; currentMigratorIndex < Migrators.length; ++currentMigratorIndex) {
      console.log(Migrators[currentMigratorIndex].version)
      Migrators[currentMigratorIndex].migrate(state)
    }
  }
}

const actions = {
  removeList (context, p) {
    for (let taskId of context.getters.taskIds(p.listId)) {
      context.dispatch('removeTask', {taskId: taskId})
    }
    context.commit('removeList', p)
  },
  removeTask (context, p) {
    let task = context.getters.task(p.taskId)
    for (let prevId of task.prevIds) {
      context.commit('removeDep', {prev: prevId, next: p.taskId})
    }
    for (let nextId of task.nextIds) {
      context.commit('removeDep', {prev: p.taskId, next: nextId})
    }
    context.commit('removeTask', p)
  },
  loadBoard (context) {
    context.commit('loadBoard')
    context.commit('mightMigrate')
  }
}

const getters = {
  taskIds: state => listId => {
    let list = state.lists[listId]
    return list.taskIds
  },
  task: (state) => (taskId) => {
    return state.tasks[taskId]
  },
  tasks: (state) => {
    return state.tasks
  },
  taskDepPrevIds: (state) => (taskId) => {
    return state.tasks[taskId].prevIds
  },
  taskDepNextIds: (state) => (taskId) => {
    return state.tasks[taskId].nextIds
  },
  listIds: state => {
    return Object.keys(state.lists)
  },
  list: (state) => (listId) => {
    return state.lists[listId]
  },
  allTaskIds: (state, getters) => {
    let taskIds = []
    for (let listId of getters.listIds) {
      taskIds = [...taskIds, ...getters.list(listId).taskIds]
    }
    return taskIds
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
