import FileSystem from 'fs'
import Vue from 'vue'
import Path from 'path'
import Mkdirp from 'mkdirp'

const state = {
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
        nextIds: []
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
    let boardFilePath = process.cwd() + '/.todev/board.json'
    if (!check(boardFilePath)) {
      Mkdirp.sync(Path.dirname(boardFilePath))
      let board = {
        name: 'BoardName',
        lists: {},
        tasks: {},
        deps: {}
      }
      FileSystem.writeFileSync(boardFilePath, JSON.stringify(board))
    }
    let jsonString = FileSystem.readFileSync(boardFilePath, 'utf8')
    let board = JSON.parse(jsonString)
    state.name = board.name
    state.lists = board.lists
    state.tasks = board.tasks
    state.deps = board.deps
  },
  saveBoard (state) {
    let jsonString = JSON.stringify(state)
    let boardFilePath = process.cwd() + '/.todev/board.json'
    FileSystem.writeFileSync(boardFilePath, jsonString)
  }
}

const actions = {
  removeList (context, p) {
    for (let taskId of context.getters.taskIds(p.listId)) {
      context.dispatch('removeTask', {taskId: taskId})
    }
    context.commit('removeList', p)
  },
  removeTask ({commit, dispatch}, p) {
    commit('removeTask', p)
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
