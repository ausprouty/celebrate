<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <div v-bind:class="this.dir">
        <link rel="stylesheet" v-bind:href="'/css/' + this.bookmark.book.style">
        <div class="app-link">
          <div class="app-card -shadow">
            <img
              v-bind:src="appDir.library + this.bookmark.language.image_dir + '/' + this.bookmark.book.image"
              class="app-img-header"
            >
          </div>
        </div>
        <h1>{{bookmark.book.title}}</h1>
        <div v-if="this.seriesDetails.description">{{this.seriesDetails.description}}</div>

        <Chapter v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"/>
        <div class="version">
          <p class="version">Version 1.01</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/Chapter.vue'
import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarBack.vue'
export default {
  props: ['countryCODE', 'languageISO', 'folderNAME', 'fileFILENAME'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    Chapter,
    NavBar
  },
  data() {
    return {
      seriesDetails: {
        series: '',
        language: '',
        description: ''
      },
      chapters: [
        {
          id: '',
          title: '',
          desciption: '',
          count: '',
          filename: ''
        }
      ],
      dir: 'ltr',
      loadinG: false,
      loading: false,
      loaded: null,
      error: null
    }
  },
  beforeCreate() {
    this.$route.params.version = 'current'
    this.$route.params.book = this.$route.params.fileFILENAME
    this.$route.params.series = this.$route.params.fileFILENAME
    this.$store.dispatch('checkBookmark', this.$route.params)
  },

  created() {
    this.error = this.loaded = null
    this.loading = true
    var ref = this
    ContentService.getSeries(this.$route.params)
      .then(response => {
        console.log(response.data) // For nseriesDetailsow, logs out the response
        ref.seriesDetails = response.data.content
        console.log('SERIES.vue - this.seriesDetails')
        console.log(ref.seriesDetails)
        ref.chapters = ref.seriesDetails.chapters
        console.log('SERIES.vue - chapters in Series.Vue')
        console.log(this.chapters)
        ref.loading = false
        ref.loaded = true
      })
      .catch(error => {
        ref.loading = false
        console.log('There was an error:', error.response) // Logs out the error
        ref.error = error.toString()
      })
  }
}
</script>
