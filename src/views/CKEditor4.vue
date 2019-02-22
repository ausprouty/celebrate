<template>
  <div>
      this is my file
    <vue-ckeditor v-model="content" language="en"></vue-ckeditor>
  </div>
</template>

<script>
import './ckeditor/index.js'
import VueCkeditor from 'vueckeditor'

export default {
  components: { VueCkeditor },
  data() {
    return {
      content: 'hi',
      toolbar: [
          ['Italic', 'Bold','Underline', 'Strike', 'Subscript', 'Superscript']
        ],
      config: {
        toolbar: [
          ['Italic', 'Bold','Underline', 'Strike', 'Subscript', 'Superscript']
        ],
        height: 300
      }
    }
  },
  methods: {
    onBlur(evt) {
      console.log(evt)
    },
    onFocus(evt) {
      console.log(evt)
    },
    onContentDom(evt) {
      console.log(evt)
    },
    onDialogDefinition(evt) {
      console.log(evt)
    },
    onFileUploadRequest(evt) {
      console.log(evt)
    },
    onFileUploadResponse(evt) {
      console.log(evt)
    }
  }
}
</script>
