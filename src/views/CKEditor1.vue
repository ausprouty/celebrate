<template>
  <vue-ckeditor type="classic" v-model="value1" :editors="editors"></vue-ckeditor>
</template>
  <script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import VueCkeditor from '@ckeditor/ckeditor5-vue'

export default {
  components: {
    'vue-ckeditor': VueCkeditor.component
  },
  data: function() {
    return {
      value1: 'hello',
      value2: 'world',
      editors: {
        classic: ClassicEditor
      }
    }
  }
}
</script>
