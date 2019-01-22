<template>
  <div>
    <img v-bind:src="appDir.library + bookmark.language.image_dir + '/' + bookmark.book.image" class="app-img-header">
    <h1>{{bookmark.book.title}}</h1>
    <p>{{bookmark.book.instructions}}</p>
    <Chapter v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"/>
    <div class = "version">
      Version 1.01
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/Chapter.vue'
import DataService from '@/services/DataService.js'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    Chapter
  },
  data() {
    return {
      seriesDetails: [],
      chapters: []
    }
  },
  created() {
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    route.book = this.bookNAME
    this.$store.dispatch('checkBookmark', route)
    DataService.getSeries(
      this.bookmark.country.code,
      this.bookmark.language.iso,
      this.bookmark.book.folder,
      this.bookmark.book.index
    )
      .then(response => {
        console.log(response.data) // For nseriesDetailsow, logs out the response
        this.seriesDetails = response.data
        console.log('this.seriesDetails')
        console.log(this.seriesDetails)

        this.chapters = this.seriesDetails.chapters
        console.log('chapters in Series.Vue')
        console.log(this.chapters)
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>
