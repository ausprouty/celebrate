<template>
  <div id="app">
    <ckeditor :editor="editor" v-model="editorData"></ckeditor>
    <button v-on:click="emptyEditor()">Empty the editor</button>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  name: 'app',
  data() {
    return {
      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>'
    }
  },
  methods: {
    emptyEditor() {
      this.editorData = ''
    }
  }
}
</script>
