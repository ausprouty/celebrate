<template>
  <div class="preview">
    <NavBar />
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{ this.error }}</div>
    <div class="content" v-if="loaded">
      <div v-if="this.publish">
        <button class="button" @click="localPublish('live')"> {{ this.publish_text }}</button>
      </div>
      <div v-if="this.prototype">
        <button class="button" @click="localPublish('prototype')">
          {{ this.prototype_text }}
        </button>
      </div>
      <link rel="stylesheet" href="/content/ZZ/styles/appGlobal.css" />
      <link rel="stylesheet" v-bind:href="style" />
 <a
            target="_blank"
            class="help"
            href="/preview/page/HD/eng/library/help-1/library_index_preview"
          >
            <img class="help-icon" src="/images/icons/help.png" />
          </a>
      <hr class="border" />
      <span v-html="pageText"></span>
      <br />
      <span v-html="footerText"></span>
      <div class="version">
        <p class="language">Version 1.01</p>
      </div>
    </div>
    <hr class="border" />
    <div v-if="write">
      <button class="button" @click="editPage">Edit</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PrototypeService from '@/services/PrototypeService.js'
import PublishService from '@/services/PublishService.js'
import NavBar from '@/components/NavBarCountry.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { libraryMixin } from '@/mixins/LibraryMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, libraryMixin, authorMixin],
  props: ['country_code', 'language_iso'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      style: 'unknown',
      prototype_text: 'Prototype',
      publish_text: 'Publish'
    }
  },

  methods: {
    editPage() {
      this.$router.push({
        name: 'editLibraryIndex',
        params: {
          country_code: this.$route.params.country_code,
          language_iso: this.$route.params.language_iso
        }
      })
    },
    goBack() {
      this.$router.push({
        name: 'previewCountries'
      })
    },
    async localPublish(location) {
      var params = {}
      var response = null
      params.recnum = this.recnum
      // params.bookmark = JSON.stringify(this.bookmark)
      params.route = JSON.stringify(this.$route.params)
      if (location == 'prototype') {
        response = await PrototypeService.publish('libraryIndex', params)
      } else {
        response = await PublishService.publish('libraryIndex', params)
      }
      if (typeof response['error'] != 'undefined') {
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
        this.$route.params.css = 'AU/styles/AU-freeform.css'

        await this.getLibraryIndex()
        if (this.recnum) {
          this.localBookmark(this.recnum)
        }
        this.write = this.authorize('write', 'world')
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
        if (this.recnum  && this.prototype_date) {
          this.publish = this.authorize(
            'publish',
            this.$route.params.country_code
          )
          if (this.publish) {
            this.prototype = true
            this.prototype_text = 'Prototype Again'
            if (this.publish_date){
               this.publish_text = 'Publish Again'
            }
          }
        }
        // end authorization for prototype and publish
      } catch (error) {
        console.log('There was an error in LibraryIndexPreview.vue:', error)
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    this.loadView()
  }
}
</script>
