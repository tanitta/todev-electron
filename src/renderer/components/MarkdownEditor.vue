<template>
  <div>
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
  components: {},
  data: function () {
    return {
      isEditing: false,
      text: ''
    }
  },
  computed: {
    compiledMarkdown: function () {
      let html = marked(this.text, { gfm: true, sanitize: true })
      return html
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
textarea {
  width: 100%;
  height: 100%;
}
.html-box{
  background-color: rgba(240, 240, 240, 0.3);
  color: #AAAAAA;
  padding:10px;
}
</style>
