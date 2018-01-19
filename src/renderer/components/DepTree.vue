<template>
  <div class="dep-tree">
    <canvas id="dep-tree-canvas" width=500 height=1000></canvas>
    <section id="tree-container">
      <template v-for="task in depSort()">
        <div :ref="'t'+task.id" class="task-container">
          <div class="task-name">
            {{task.name}}
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
  import TopSort from 'topological-sort'
  export default{
    name: 'dep-tree',
    props: [
      'board'
    ],
    methods: {
      depSort: function () {
        console.log('sort tree')
        let sortOp = new TopSort(new Map())
        let edges = []
        for (let task of this.tasks()) {
          sortOp.addNode(task.id, task)
          task.nexts.forEach(nextTaskId => {
            edges.push({from: task.id, to: nextTaskId})
          })
        }
        edges.forEach(edge => {
          sortOp.addEdge(edge.from, edge.to)
        })
        let sorted = sortOp.sort()
        // return Array.from(sorted.()).map(k => sorted[k])

        this.$nextTick(function () {
          this.drawCanvas(edges)
        })
        return Array.from(sorted.values())
      },
      drawCanvas: function (edges) {
        console.log('redraw canvas')
        console.log(edges)
        let canvasElement = document.getElementById('dep-tree-canvas')
        let ctx = canvasElement.getContext('2d')
        let canvasPos = document.getElementById('dep-tree-canvas').getBoundingClientRect()

        ctx.clearRect(0, 0, canvasPos.width, canvasPos.height)
        ctx.fillStyle = '#AAAAAA'
        ctx.strokeStyle = '#AAAAAA'
        let offset = 10

        this.tasks().forEach((task) => {
          let taskRect = this.$refs['t' + task.id][0].getBoundingClientRect()
          let center = {
            x: offset,
            y: taskRect.top - canvasPos.top + taskRect.height / 2
          }
          ctx.beginPath()
          ctx.arc(center.x, center.y, 6, 0, Math.PI * 2, true)
          ctx.fill()
        })

        edges.forEach((edge) => {
          let refFrom = this.$refs['t' + edge.from][0].getBoundingClientRect()
          let refTo = this.$refs['t' + edge.to][0].getBoundingClientRect()

          let startPos = {
            x: refFrom.left - canvasPos.left + offset,
            y: refFrom.top - canvasPos.top + refFrom.height / 2
          }

          let finishPos = {
            x: refTo.left - canvasPos.left + offset,
            y: refTo.top - canvasPos.top + refTo.height / 2
          }

          let distance = Math.abs(startPos.y - finishPos.y)

          let controlPoint = {
            x: (startPos.x + finishPos.x) / 2 + distance * 0.3,
            y: (startPos.y + finishPos.y) / 2
          }

          ctx.beginPath()
          ctx.moveTo(startPos.x, startPos.y)
          ctx.bezierCurveTo(
            startPos.x + distance * 0.2,
            startPos.y,
            controlPoint.x,
            controlPoint.y - distance / 2,
            controlPoint.x,
            controlPoint.y
          )
          ctx.bezierCurveTo(
            controlPoint.x,
            controlPoint.y + distance / 2,
            finishPos.x + distance * 0.2,
            finishPos.y,
            finishPos.x,
            finishPos.y
          )
          ctx.stroke()
        })
      },
      tasks: function () {
        let tasks = []
        for (var l of this.board.lists) {
          Array.prototype.push.apply(tasks, l.tasks)
        }
        return tasks
      },
      depTaskFromId: function (id) {
        let tasksMatchedToId = this.tasks().filter(task => { return task.id === id })
        return tasksMatchedToId[0]
      }
    }
  }
</script>

<style>
  .dep-tree {
    box-sizing: border-box;
    position:relative;
    flex: 0 1 auto;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  #dep-tree-canvas{
    position:absolute;
  }

  #tree-container {
    position: relative;
    top: 0;
    left: 0;
  }

  .task-name {
    background-color: rgba(240, 240, 240, 0.5);
    color: #AAAAAA;
    margin-left:100px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding:6px;
  }
  .task-container{
  }
</style>
