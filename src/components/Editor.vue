<script>
import Quill from 'quill'
import editor from '@\components\QuillComponent.vue'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      editor: null,
      model: 'Bob is cool'
    }
  },
  mounted() {
    this.editor = new Quill(this.$refs.editor, {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, false] }],
          ['bold', 'italic', 'underline']
        ]
      },
      theme: 'bubble',
      formats: ['bold', 'underline', 'header', 'italic']
    })

    this.editor.root.innerHTML = this.value
    console.log('settin up quill')

    this.editor.on('text-change', () => this.update())
  },

  methods: {
    update() {
      this.$emit(
        'input',
        this.editor.getText() ? this.editor.root.innerHTML : ''
      )
    }
  }
}
</script>

<template>
<div>
    <div ref="editor">
        <editor v-model="model"></editor></div>
    Hi Bob
    </div>
</template>
