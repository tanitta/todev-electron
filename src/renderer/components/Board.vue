<template>
  <div class="board">
    <div class="lists">
      <template v-for="listId in listIds">
        <task-list :list-id="listId"></task-list>
      </template>
      <el-button type="default" size="mini" icon="el-icon-plus" v-on:click="addList"></el-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import TaskList from './TaskList'
  import DepTree from './DepTree'

  export default{
    name: 'board',
    components: {
      TaskList,
      DepTree
    },
    mounted: function () {
    },
    methods: {
      addList: function () {
        this.$store.commit('addList')
      }
    },
    computed: {
      ...mapGetters({
        listIds: 'listIds'
      })
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
body { font-family: 'Source Sans Pro', sans-serif; }

.board{
  height: 100%;
  display:flex;
  flex-direction: row;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;

}
.lists{
  flex: 0 1 auto;
  user-select: none;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  padding-right: 56px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
}
</style>
