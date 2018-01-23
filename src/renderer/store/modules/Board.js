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
  addList (state) {
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
    Vue.delete(state.lists, p.id)
  },
  addTask (state, p) {
  },
  removeTask (state, p) {
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
}

const getters = {
  tasks: state => listId => {
    let list = state.lists[listId]
    return list.taskIds.map(taskId => state.tasks[taskId])
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
