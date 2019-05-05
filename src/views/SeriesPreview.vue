<template>
  <div class="preview">
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...{{this.error}}</div>
    <div class="content" v-if="loaded">
      <div v-if="this.publish">
        <button class="button" @click="this.publish('series', this.$route.params)">Publish</button>
     </div>
      <div v-bind:class="this.dir">
        <link rel="stylesheet" v-bind:href="'/css/' + this.style">
        <div class="app-link">
          <div class="app-card -shadow">
            <a
              v-bind:href="'/preview/languages/' + this.bookmark.country.code + '/' +  + this.bookmark.language.iso"
            >
              <img
                v-bind:src="appDir.library + this.image_dir + '/' + this.bookmark.book.image"
                class="app-img-header"
              >
            </a>
          </div>
        </div>
        <h2>{{bookmark.book.title}}</h2>
        <div v-if="this.description">{{this.description}}</div>
        <br>
        <br>

        <Chapter v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"/>
        <div class="version">
          <p class="version">Version 1.01</p>
        </div>
      </div>
    </div>
    <div v-if="this.write">
      <button class="button" @click="editSeries">Edit</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button class="button" @click="sortSeries">Sort</button>
    </div>
    <div v-if="this.readonly">
      <button class="button" @click="editSeries">View Details</button>
    </div>
    <br>
    <br>
    <br>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/ChapterPreview.vue'
import AuthorService from '@/services/AuthorService.js'
import PublishService from '@/services/PublishService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { seriesMixin } from '@/mixins/SeriesMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, seriesMixin, authorMixin],
  props: ['countryCODE', 'languageISO', 'bookNAME'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    Chapter,
    NavBar
  },
  data() {
    return {
      readonly: false,
      write: false,
       publish: false
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
    sortSeries() {
      this.$router.push({
        name: 'sortSeries',
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
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      await this.getSeries(this.$route.params)
      if (
        this.bookmark.series.length == 0 &&
        this.$route.params.fileFILENAME == 'first_steps'
      ) {
        await AuthorService.setupSeriesFirstSteps(this.$route.params)
        await this.getSeries(this.$route.params)
      }
      this.readonly = this.authorize('readonly', this.$route.params.countryCODE)
      this.write = this.authorize('write', this.$route.params.countryCODE)
       this.publish = this.authorize('publish', this.$route.params.countryCODE)
      this.loaded = true
      this.loading = false
    } catch (error) {
      console.log('There was an error in SeriesEdit.vue:', error) // Logs out the error
    }
  }
}
</script>
