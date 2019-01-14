<template>
  <div>
    <h1>This is the index page for {{this.series.series}} series</h1>
    <Chapter v-for="chapter in chapters" :key="chapter.id" :series="chapter"/>
  </div>
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
      seriesDetails: [],
      chapters:[]
    }
  },
  created() {
    DataService.getSeries(
      this.bookmark.country.code,
      this.bookmark.language.folder,
      this.bookmark.book.folder,
      this.bookmark.book.index
    )
      .then(response => {
        console.log(response.data) // For nseriesDetailsow, logs out the response
        this.seriesDetails = response.data[0]
        console.log('this.seriesDetails')
        console.log(this.seriesDetails)
        
        var chapters = this.seriesDetails.chapters
        console.log('chapters')
        console.log(chapters)
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>
}
</script>
