<template>
  <div class="preview">
    <NavBar />
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...{{ this.error }}</div>
    <div class="content" v-if="loaded">
      <div v-if="this.publish">
        <button class="button" @click="localPublish('live')">Publish</button>
      </div>
      <div v-if="this.prototype">
        <button class="button" @click="localPublish('prototype')">
          {{ this.prototype_text }}
        </button>
        <div v-if="this.prototype_series">
          <button class="button" @click="localPublish('prototypeSeries')">
            Prototype Entire Series
          </button>
        </div>
      </div>
      <div v-bind:class="this.dir">
        <link rel="stylesheet" v-bind:href="'/content/' + this.style" />
        <div class="app-link">
          <div class="app-card -shadow">
            <img
              v-on:click="returnToIndex()"
              v-bind:src="
                appDir.library + this.image_dir + '/' + this.bookmark.book.image
              "
              class="app-img-header"
            />
          </div>
        </div>
        <div v-if="!bookmark.language.titles">
          <h2>{{ bookmark.book.title }}</h2>
        </div>
        <div v-if="this.description">{{ this.description }}</div>
        <br />
        <p id="offline-ready">{{ this.download_ready }}</p>

        <br />

        <Chapter
          v-for="chapter in chapters"
          :key="chapter.id"
          :chapter="chapter"
        />
      </div>
      <div>
        <p class="button">
          <button id="offline-request" class="cache-series">
            {{ this.download_now }}
          </button>
        </p>
      </div>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
    <hr />
    <div v-if="this.write">
      <button class="button" @click="editSeries">Edit</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button class="button" @click="sortSeries">Sort</button>
    </div>
    <div v-if="this.readonly">
      <button class="button" @click="editSeries">View Details</button>
    </div>
    <br />
    <br />
    <br />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/ChapterPreview.vue'
import AuthorService from '@/services/AuthorService.js'
import PrototypeService from '@/services/PrototypeService.js'
import PublishService from '@/services/PublishService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { seriesMixin } from '@/mixins/SeriesMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, seriesMixin, authorMixin],
  props: ['country_code', 'language_iso', 'library_code', 'folder_name'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    Chapter,
    NavBar
  },
  data() {
    return {
      readonly: false,
      write: false,
      publish: false,
      prototype_text: 'Prototype',
      download_ready: '',
      download_now: '',
      description: '',
      style: ''
    }
  },

  methods: {
    editSeries() {
      this.$router.push({
        name: 'editSeries',
        params: {
          country_code: this.$route.params.country_code,
          language_iso: this.$route.params.language_iso,
          library_code: this.$route.params.library_code,
          folder_name: this.$route.params.folder_name
        }
      })
    },
    sortSeries() {
      this.$router.push({
        name: 'sortSeries',
        params: {
          country_code: this.$route.params.country_code,
          language_iso: this.$route.params.language_iso,
          library_code: this.$route.params.library_code,
          folder_name: this.$route.params.folder_name
        }
      })
    },
    goBack() {
      window.history.back()
    },
    returnToIndex() {
      this.$router.push({
        name: 'previewLibrary',
        params: {
          country_code: this.$route.params.country_code,
          language_iso: this.$route.params.language_iso,
          library_code: this.$route.params.library_code
        }
      })
    },
    async localPublish(location) {
      var response = null
      var params = []
      params.recnum = this.recnum
      //params.bookmark = JSON.stringify(this.bookmark)
      params.route = JSON.stringify(this.$route.params)
      if (location == 'prototype') {
        response = await PrototypeService.publish('series', params)
      }
      if (location == 'prototypeSeries') {
        response = await PrototypeService.publish('seriesAndChapters', params)
      }
      if (location == 'live') {
        response = await PublishService.publish('series', params)
      }
      if (response['error']) {
        this.error = response['message']
        this.loaded = false
      } else {
        this.UnsetBookmarks()
        this.recnum = null
        this.loaded = false
        this.loading = true
        this.publish = false
        await this.loadView()
      }
    },
    async localBookmark(recnum) {
      var param = {}
      param.recnum = recnum
      param.library_code = this.$route.params.library_code
      var bm = await PrototypeService.publish('bookmark', param)
      console.log('localBookmark')
      console.log(bm)
    },
    async loadView() {
      try {
        await this.getSeries(this.$route.params)
        if (this.recnum) {
          this.localBookmark(this.recnum)
        }
        if (
          this.bookmark.series.length == 0 &&
          this.$route.params.filename == 'first_steps'
        ) {
          await AuthorService.setupSeriesFirstSteps(this.$route.params)
          await this.getSeries(this.$route.params)
        }
        this.series_image_dir =
          this.$route.params.country_code +
          '/' +
          this.$route.params.language_iso +
          '/' +
          this.$route.params.folder_name
        this.readonly = this.authorize(
          'readonly',
          this.$route.params.country_code
        )
        this.write = this.authorize('write', this.$route.params.country_code)

        // authorize for prototype and publish
        this.publish = false
        this.prototype = false
        if (this.recnum && !this.prototype_date) {
          this.prototype = this.authorize(
            'publish',
            this.$route.params.country_code
          )
          if (this.prototype) {
            this.prototype_text = 'Prototype'
          }
        }
        if (this.recnum && !this.publish_date && this.prototype_date) {
          this.publish = this.authorize(
            'publish',
            this.$route.params.country_code
          )
          if (this.publish) {
            this.prototype = true
            this.prototype_text = 'Prototype Again'
          }
        }
        var params = {}
        params.recnum = this.recnum
        this.prototype_series = await PrototypeService.publish(
          'readyToPrototypeSeries',
          params
        )
        // end authorization for prototype and publish

        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in SeriesEdit.vue:', error) // Logs out the error
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    await this.loadView()
  }
}
</script>
