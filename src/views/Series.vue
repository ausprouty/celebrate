<template>
  <h1>This is the index page for {{series}} series</h1>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/Chapter.vue'
import DataService from '@/services/DataService.js'
export default {
  props: ['folder', 'series'],
  computed: mapState(['bookmark', 'imgDir']),
  components: {
    Chapter
  },
  data() {
    return {
      library: []
    }
  },
  created() {
    DataService.getSeries(bookmark.country.code, bookmark.language.folder, 'folder', 'series')
      .then(response => {
        console.log(response.data) // For now, logs out the response
        this.library = response.data
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>
}
</script>
