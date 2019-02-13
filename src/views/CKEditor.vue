<template >
  <div>
    <vue-ckeditor v-model="content"></vue-ckeditor>
  </div>
</template>

<script>
var CKEDITOR_BASEPATH = 'src/assets/js/ckedit/'
import CKEDITOR from 'ckeditor'
import VueCkeditor from 'vueckeditor'
export default {
  components: {
    VueCkeditor,
    CKEDITOR
  },
  data() {
    return {
      content: 'Hello World!'
    }
  },
  created() {
    console.log('I am in CKEditor.Vue')
  }
}
</script>
