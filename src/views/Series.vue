<template>
  <div>
    <img
      v-bind:src="appDir.library + bookmark.language.image_dir + '/' + bookmark.book.image"
      class="app-img-header"
    >
    <h1>{{bookmark.book.title}}</h1>
    <p>{{this.series.description}}</p>

    <Chapter v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"/>
    <div class="version">
      <p class="version">Version 1.01</p>
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
      series: [],
      chapters: []
    }
  },
  created() {
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    route.book = this.bookNAME
    route.series = this.bookNAME
    console.log('route in Series.vue')
    console.log(route)
    this.$store
      .dispatch('checkBookmark', route)
      .then(response => {
        this.series = this.bookmark.series
        this.chapters = this.series.chapters
        console.log('chapters in Series.Vue')
        console.log(this.chapters)
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>
