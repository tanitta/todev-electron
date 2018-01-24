<template>
  <div class="main-page">
    <board></board>
    <dep-tree/>
    <task-editor></task-editor>
  </div>
</template>

<script>
  import TaskEditor from './TaskEditor'
  import Board from './Board'
  import DepTree from './DepTree'
  export default{
    name: 'main-page',
    components: { Board, TaskEditor, DepTree },
    mounted: function () {
      this.$store.commit('loadBoard')
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'saveBoard') return
        this.$store.commit('saveBoard')
      })
    },
    methods: {
    }
  }
</script>

<style>
  .main-page{
    position: absolute;
    color: #DDDDDD;
    top: 0;
    height: 100vh;
    width: 100vw;

    display:flex;
    flex-direction: row;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
  }
</style>
