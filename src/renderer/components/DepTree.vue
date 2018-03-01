<template>
  <div class="dep-tree">
    <canvas id="dep-tree-canvas" width=500 height=1000></canvas>
    <section id="tree-container">
      <template v-for="taskId in depSort()">
        <div :ref="'t'+taskId">
        <dep-tree-card :taskId="taskId"/>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
  import TopSort from 'topological-sort'
  import DepTreeCard from './DepTreeCard'
  export default{
    name: 'dep-tree',
    components: { DepTreeCard },
    computed: {
      tasks: function () {
        return this.$store.getters.allTaskIds.map(id => this.$store.getters.task(id))
      },
      allTaskIds: function () {
        return this.$store.getters.allTaskIds
      }
    },
    mounted: function () {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'saveBoard') return
        this.depSort()
      })
    },
    methods: {
      task: function (id) {
        return this.$store.getters.task(id)
      },
      depSort: function () {
        let sortOp = new TopSort(new Map())
        let edges = []
        for (let taskId of this.allTaskIds) {
          sortOp.addNode(taskId, taskId)
          this.task(taskId).nextIds.forEach(nextTaskId => {
            let edge = {from: taskId, to: nextTaskId}
            edges.push(edge)
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
        let canvasElement = document.getElementById('dep-tree-canvas')
        let taskContainerRect = document.getElementById('tree-container').getBoundingClientRect()
        canvasElement.width = taskContainerRect.width
        canvasElement.height = taskContainerRect.height

        let ctx = canvasElement.getContext('2d')
        let canvasPos = document.getElementById('dep-tree-canvas').getBoundingClientRect()

        ctx.clearRect(0, 0, canvasPos.width, canvasPos.height)
        ctx.lineWidth = 3
        let offset = 16
        let radius = 5

        edges.forEach((edge) => {
          let refFrom = this.$refs['t' + edge.from][0].getBoundingClientRect()
          let refTo = this.$refs['t' + edge.to][0].getBoundingClientRect()

          let startPos = {
            x: refFrom.left - canvasPos.left + offset + radius,
            y: refFrom.top - canvasPos.top + refFrom.height / 2
          }

          let finishPos = {
            x: refTo.left - canvasPos.left + offset + radius,
            y: refTo.top - canvasPos.top + refTo.height / 2
          }

          let distance = Math.abs(startPos.y - finishPos.y)

          let controlPoint = {
            x: (startPos.x + finishPos.x) / 2 + distance * 0.3,
            y: (startPos.y + finishPos.y) / 2
          }

          let color = 'rgb(240, 240, 240)'
          {
            let prevTask = this.task(edge.from)
            let numPrevNoArchivedTasks = prevTask.prevIds.map(id => this.task(id)).filter(task => !task.isArchived).length
            if (prevTask.isArchived) {
              color = 'rgb(240, 240, 240)'
            } else {
              if (numPrevNoArchivedTasks === 0) {
                color = 'hsl(100, 80%, 82%)'
              } else {
                color = 'rgb(200, 200, 200)'
              }
            }
          }

          ctx.fillStyle = color
          ctx.strokeStyle = color

          ctx.beginPath()
          ctx.moveTo(startPos.x, startPos.y)
          ctx.bezierCurveTo(
            startPos.x + distance * 0.1,
            startPos.y,
            controlPoint.x,
            controlPoint.y - distance / 2,
            controlPoint.x,
            controlPoint.y
          )
          ctx.bezierCurveTo(
            controlPoint.x,
            controlPoint.y + distance / 2,
            finishPos.x + distance * 0.1,
            finishPos.y,
            finishPos.x,
            finishPos.y
          )
          ctx.stroke()
        })

        ctx.strokeStyle = 'rgb(230, 230, 230)'
        this.allTaskIds.forEach((taskId) => {
          let task = this.task(taskId)
          if (this.$refs['t' + taskId]) {
            let taskRect = this.$refs['t' + taskId][0].getBoundingClientRect()
            let numNexts = task.nextIds.length
            let center = {
              x: offset,
              y: taskRect.top - canvasPos.top + taskRect.height / 2
            }

            let numPrevNoArchivedTasks = task.prevIds.map(id => this.task(id)).filter(task => !task.isArchived).length
            if (task.isArchived) {
              let size = 8
              ctx.fillStyle = 'rgb(250, 250, 250)'
              ctx.lineWidth = 5
              ctx.beginPath()
              ctx.moveTo(center.x + size, center.y + size)
              ctx.lineTo(center.x - size, center.y - size)
              ctx.stroke()
              ctx.beginPath()
              ctx.moveTo(center.x - size, center.y + size)
              ctx.lineTo(center.x + size, center.y - size)
              ctx.stroke()
            } else {
              if (numPrevNoArchivedTasks === 0) {
                ctx.fillStyle = 'hsl(100, 80%, 70%)'
              } else {
                ctx.fillStyle = 'rgb(200, 200, 200)'
              }
              ctx.beginPath()
              ctx.arc(center.x, center.y, radius + numNexts * 2, 0, Math.PI * 2, true)
              ctx.fill()
            }
          }
        })
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
</style>
