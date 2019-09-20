<template>
  <div class="preview" v-bind:dir="this.rldir">
    <link rel="stylesheet" v-bind:href="'/content/' + this.format.style" />
    <NavBar />
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{ this.error }}</div>
    <div class="content" v-if="loaded">
      <div v-if="this.publish">
        <button class="button" @click="localPublish('live')">
          {{ this.publish_text }}
        </button>
      </div>
      <div v-if="this.prototype">
        <button class="button" @click="localPublish('prototype')">
          {{ this.prototype_text }}
        </button>
      </div>
       <a
            target="_blank"
            class="help"
            href="/preview/page/HD/eng/library/help-1/library_preview"
          >
            <img class="help-icon" src="/images/icons/help.png" />
          </a>
      <hr class="border" />
      <a v-bind:href="this.back">
        <img v-bind:src="this.format.image.image" class="app-img-header" />
      </a>
      <div>
        
        <span v-html="text"></span>
      </div>

      <Book v-for="book in books" :key="book.title" :book="book" />
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
      <hr class="border" />
    </div>
    <div v-if="this.write">
      <button class="button" @click="editLibrary">Edit</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button class="button" @click="sortLibrary">Sort</button>
    </div>
    <div v-if="this.readonly">
      <button class="button" @click="editLibrary">View Details</button>
    </div>
  </div>
</template>

<script>
import Book from '@/components/BookPreview.vue'
import { mapState } from 'vuex'
import NavBar from '@/components/NavBarAdmin.vue'
import PrototypeService from '@/services/PrototypeService.js'
import PublishService from '@/services/PublishService.js'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { libraryMixin } from '@/mixins/LibraryMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, libraryMixin, authorMixin],
  props: ['country_code', 'language_iso', 'library_code'],
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  components: {
    Book,
    NavBar
  },
  data() {
    return {
      readonly: false,
      write: false,
      publish: false,
      prototype_text: 'Prototype Library and Books',
      publish_text: 'Publish Library and Books',
      back: 'country',
      format: {}
    }
  },
  methods: {
    editLibrary() {
      this.$router.push({
        name: 'editLibrary',
        params: {
          country_code: this.$route.params.country_code,
          language_iso: this.$route.params.language_iso,
          library_code: this.$route.params.library_code
        }
      })
    },
    sortLibrary() {
      this.$router.push({
        name: 'sortLibrary',
        params: {
          country_code: this.$route.params.country_code,
          language_iso: this.$route.params.language_iso,
          library_code: this.$route.params.library_code
        }
      })
    },
    goBack() {
      window.history.back()
    },
    async localPublish(location) {
      var response = null
      var params = {}
      params.recnum = this.recnum
      //params.bookmark = JSON.stringify(this.bookmark)
      params.route = JSON.stringify(this.$route.params)

      if (location == 'prototype') {
        response = await PrototypeService.publish('libraryAndBooks', params)
      }
      if (location == 'live') {
        response = await PublishService.publish('libraryAndBooks', params)
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
        this.recnum = null
        this.$store.dispatch('newBookmark', 'clear')
        await this.getLibrary()
        if (this.recnum) {
          this.localBookmark(this.recnum)
        }
        this.back = '/preview/languages/' + this.$route.params.country_code
        if (this.$route.params.library_code != 'library') {
          this.back =
            '/preview/libraryIndex/' +
            this.$route.params.country_code +
            '/' +
            this.$route.params.language_iso
        }
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
        //  if (this.recnum && !this.publish_date && this.prototype_date) {
        if (this.recnum && this.prototype_date) {
          this.publish = this.authorize(
            'publish',
            this.$route.params.country_code
          )
          if (this.publish) {
            this.prototype = true
            this.prototype_text = 'Prototype Library and Books Again'
          }
          if (this.publish_date) {
            this.publish_text = 'Publish Library and Books Again'
          }
        }
        // end authorization for prototype and publish

        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in LibraryPreview.vue:', error) // Logs out the error
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
