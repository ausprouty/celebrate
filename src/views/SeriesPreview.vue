<template>
  <div class="preview">>
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
        <div v-if="this.bookmark.series.description">{{this.bookmark.series.description}}</div>

        <Chapter v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"/>
        <div class="version">
          <p class="version">Version 1.01</p>
        </div>
      </div>
    </div>
    <button class="button" @click="editSeries">Edit</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/ChapterPreview.vue'
import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarAdmin.vue'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME'],
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
  methods: {
    editSeries() {
      this.$router.push({
        name: 'editSeries',
        params: {
          countryCODE: this.countryCODE,
          languageISO: this.languageISO,
          bookNAME: this.bookNAME
        }
      })
    },
    goBack() {
      window.history.back()
    }
  },
  created() {
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    var ref = this
    ref.version = 'latest'
    route.country = this.$route.params.countryCODE
    route.language = this.$route.params.languageISO
    route.book = this.$route.params.bookNAME // we need book to get style sheet
    route.series = this.$route.params.bookNAME
    this.$store.dispatch('checkBookmark', route).then(response => {
      ContentService.getSeries(
        this.bookmark.country.code,
        this.bookmark.language.iso,
        this.bookmark.book.folder,
        this.bookmark.book.index,
        ref.version
      )
        .then(response => {
          console.log(response.data) // For nseriesDetailsow, logs out the response
          this.seriesDetails = JSON.parse(response.data.content.text)
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
