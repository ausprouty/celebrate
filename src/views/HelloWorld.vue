<template >
  <div>
    <vue-ckeditor v-model="content" language="en"></vue-ckeditor>
  </div>
</template>
<script>

  import './ckeditor'

  import VueCkeditor from 'vueckeditor'
  export default {
    components: {
      VueCkeditor
    },
    data() {
      return {
        content: 'Hi Bob! How are you?'
      }
    },

    created() {

    }
  }
</script>
