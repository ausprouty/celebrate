<template>
  <div>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <link rel="stylesheet" v-bind:href="'/css/' + this.bookmark.book.style">
      <div class="app-link" v-on:click="goBack()">
        <div class="app-card -shadow">
          <img
            v-bind:src="appDir.library + this.bookmark.language.image_dir + '/' + this.bookmark.book.image"
            class="app-img-header"
          >
          <img v-bind:src="appDir.root+'backbar.png'" class="app-img-header">
        </div>
      </div>
      <h1>{{bookmark.book.title}}</h1>
      <div v-if="this.bookmark.series.description">{{this.bookmark.series.description}}</div>

      <Chapter v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"/>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
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
      chapters: [],
      loading: false,
      loaded: null,
      error: null
    }
  },
  methods: {
    goBack() {
      window.history.back()
    }
  },
  created() {
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    route.book = this.bookNAME // we need book to get style sheet
    route.series = this.bookNAME
    this.$store.dispatch('checkBookmark', route).then(response => {
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
          this.loading = false
          this.loaded = true
        })
        .catch(error => {
          this.loading = false
          console.log('There was an error:', error.response) // Logs out the error
          this.error = error.toString()
        })
    })
  }
}
</script>
