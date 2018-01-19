<template>
  <transition name="modal">
    <div class="modal-mask" v-if="showEditor">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <template v-if="isChangingName">
                <input v-model="nameOnForm" @keydown.enter="changeName()" @blur="changeName()" ref="r1" />
              </template>
              <template v-else="">
                <span @click="focusName">{{nameOnForm}}</span>
              </template>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <div>
                <br>Prevs:</br>
                <dep-selector :type="'prev'" :event-bus="prevDepEventBus" :dep-ids-init="prevDepIds" :lists="lists" :self-task-id="id"/>
                <br>Nexts:</br>
                <dep-selector :type="'next'" :event-bus="nextDepEventBus" :dep-ids-init="nextDepIds" :lists="lists" :self-task-id="id"/>
                <br/>
                Description: {{description}}
              </div>
              <div>
                <el-button type="danger" size="mini" icon="el-icon-delete" v-on:click="removeTask"></el-button>
                <el-button type="default" size="mini" icon="el-icon-close" v-on:click="close"></el-button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import EventBus from './../event-bus'
import DepSelector from './DepSelector'
import Vue from 'vue'

export default{
  name: 'task-editor',
  components: { DepSelector },
  data: function () {
    return {
      showEditor: false,
      isChangingName: false,
      targetTasks: [],
      nameOnForm: '',
      prevDepEventBus: new Vue(),
      nextDepEventBus: new Vue(),
      lists: []
    }
  },
  computed: {
    prevDepIds: {
      get: function () {
        return this.targetTasks[0].prevs
      },
      set: function (ids) {
        this.targetTasks[0].prevs = ids
      }
    },
    nextDepIds: {
      get: function () {
        return this.targetTasks[0].nexts
      },
      set: function (ids) {
        this.targetTasks[0].nexts = ids
      }
    },
    description: {
      get: function () {
        return this.targetTasks[0].description
      },
      set: function (str) {
        this.targetTasks[0].description = str
      }
    },
    name: {
      get: function () {
        return this.targetTasks[0].name
      },
      set: function (n) {
        this.targetTasks[0].name = n
      }
    },
    id: {
      get: function () {
        return this.targetTasks[0].id
      }
    }
  },
  methods: {
    cancelChangingName: function () {
      this.nameOnForm = this.name
      this.isChangingName = false
    },
    changeName: function () {
      if (!this.showEditor) return
      if (this.nameOnForm.length > 0) {
        this.name = this.nameOnForm
      } else {
        this.nameOnForm = 'Enter task name'
        this.name = 'Enter task name'
      }
      this.isChangingName = false
    },
    open: function (payload) {
      this.targetTasks = payload.selectedTasks
      this.lists = payload.lists
      this.showEditor = true
      if (payload.isFocus) {
        this.focusName()
        // this.name = ''
      }

      this.prevDepEventBus.$on('setDepsToTask', depIds => {
        this.prevDepIds = depIds
      })
      this.nextDepEventBus.$on('setDepsToTask', depIds => {
        this.nextDepIds = depIds
      })
      this.prevDepEventBus.$emit('setDepsToSelector', this.prevDepIds)
      this.nextDepEventBus.$emit('setDepsToSelector', this.nextDepIds)
      this.nameOnForm = this.name
    },
    focusName: function () {
      this.isChangingName = true
      this.$nextTick(function () { this.$refs.r1.focus() })
    },
    close: function () {
      this.changeName()
      this.isChangingName = false
      this.showEditor = false
    },
    removeTask: function () {
      EventBus.$emit('remove-task', this.targetTasks[0])
      this.isChangingName = false
      this.targetTasks = []
      this.showEditor = false
    },
    escapeKeyListener: function () {
      if (event.keyCode === 27 && this.showEditor) {
        this.close()
      }
    }
  },
  mounted: function () {
    EventBus.$on('open-task-editor', this.open)
    document.addEventListener('keyup', this.escapeKeyListener)
  }
}
</script>

<style>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.modal-header {
  margin-top: 0;
}

button, input, select, textarea {
  font-family : inherit;
  font-size   : 100%;
} 

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
