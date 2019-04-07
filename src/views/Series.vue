<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <div v-bind:class="this.dir">
        <link rel="stylesheet" v-bind:href="'/css/' + this.bookmark.book.style">
        <div class="app-link">
          <div class="app-card -shadow">
            <a v-bind:href= "/library/ + this.$route.params.countryCODE + '/' + this.$route.params.languageISO">
            <img
              v-bind:src="appDir.library + this.bookmark.language.image_dir + '/' + this.bookmark.book.image"
              class="app-img-header"
            >
            </a>
          </div>
        </div>
        <h2>{{this.bookmark.book.title}}</h2>
        <div v-if="this.description">{{this.description}}</div><br><br>

        <Chapter v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"/>
        <div class="version">
          <p class="version">Version 1.11</p>
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
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { seriesMixin } from '@/mixins/SeriesMixin.js'
export default {
  mixins: [bookMarkMixin, seriesMixin],
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
      description: '',
      dir: 'ltr',
      loading: false,
      loaded: null,
      error: null
    }
  },
  beforeCreate() {
    this.$route.params.version = 'current'
  },
  async created() {
    try {
      this.getSeries(this.$route.params)
    } catch (error) {
      console.log('There was an error in SeriesEdit.vue:', error) // Logs out the error
    }
  }
}
</script>
