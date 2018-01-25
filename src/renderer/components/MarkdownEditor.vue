<template>
  <div class="markdown-editor">
    <template v-if="isEditing">
      <textarea :value="text" @keydown.esc="update()" @blur="update()" ref="markdowneditor" />
    </template>
    <template v-else="">
      <div class="html-box" @click="focusName" >
        <div v-html="compiledMarkdown"></div>
      </div>
    </template>
  </div>
</template>

<script>
import marked from 'marked'
export default{

  name: 'markdown-editor',
  props: [
    'event-bus',
    'text-input'
  ],
  data: function () {
    return {
      isEditing: false
    }
  },
  computed: {
    text: {
      get: function () {
        return this.textInput
      },
      set: function (t) {
        this.eventBus.$emit('change', t)
      }
    },
    compiledMarkdown: function () {
      let renderer = new marked.Renderer()
      renderer.image = function (href, title, text) {
        if (title) {
          var size = title.split('x')
          if (size[1]) {
            size = 'width=' + size[0] + ' height=' + size[1]
          } else {
            size = 'width=' + size[0]
          }
        } else {
          size = ''
        }
        return ('<img src="' + href + '" alt="' + text + '" ' + size + '>')
      }
      return marked(this.text, { renderer: renderer, gfm: true, sanitize: true })
    }
  },
  methods: {
    focusName: function () {
      this.isEditing = true
      this.$nextTick(function () { this.$refs.markdowneditor.focus() })
    },
    update: function () {
      this.text = this.$refs.markdowneditor.value
      this.isEditing = false
    }
  }
}
</script>

<style>
  .markdown-editor{
    width: 100%;
    height: 100%;
  }
  textarea {
    width: 100%;
    height: 100%;
  }
  .html-box{
    padding:10px;
    width: 100%;
    height: 100%;
    background-color: rgba(240, 240, 240, 0.3);
    color: #AAAAAA;
  }
</style>
