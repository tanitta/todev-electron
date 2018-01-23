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
    let id = (new Date()).getTime()
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
  listIds: state => {
    return Object.keys(state.lists)
  },
  list: (state) => (listId) => {
    return state.lists[listId]
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
