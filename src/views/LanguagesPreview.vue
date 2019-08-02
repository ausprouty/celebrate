<template>
  <div class="preview">
    <NavBar />
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{ this.error }}</div>
    <div class="content" v-if="loaded">
      <div v-if="this.publish">
        <button class="button" @click="localPublish('live')">Publish</button>
      </div>
      <div v-if="this.prototype">
        <button class="button" @click="localPublish('prototype')">
          {{ this.prototype_text }}
        </button>
      </div>
      <a href="preview/languages">
        <img
          v-bind:src="appDir.root + 'languages.jpg'"
          class="app-img-header"
        />
      </a>

      <h1>{{ this.choose_language }}</h1>
      <Language
        v-for="language in languages"
        :key="language.iso"
        :language="language"
      />
      <div v-if="!this.ZZ">
        <a href="/languages/ZZ">{{ this.more_languages }}</a>
      </div>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
      <div v-if="this.write">
        <button class="button" @click="editLanguages">Edit</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button class="button" @click="sortLanguages">Sort</button>
      </div>
      <div v-if="this.readonly">
        <button class="button" @click="editLanguages">View Details</button>
      </div>
    </div>
  </div>
</template>

<script>
import Language from '@/components/LanguagePreview.vue'
import NavBar from '@/components/NavBarAdmin.vue'
import PrototypeService from '@/services/PrototypeService.js'
import PublishService from '@/services/PublishService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { languageMixin } from '@/mixins/LanguageMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, languageMixin, authorMixin],
  props: ['country_code'],
  components: {
    Language,
    NavBar
  },
  data() {
    return {
      readonly: false,
      write: false,
      publish: false,
      prototype_text: 'Prototype',
      more_languages: 'More Languages',
      choose_language: 'Choose Language'
    }
  },
  computed: mapState(['bookmark', 'appDir']),
  methods: {
    editLanguages() {
      this.$router.push({
        name: 'editLanguages',
        params: {
          country_code: this.country_code
        }
      })
    },
    sortLanguages() {
      this.$router.push({
        name: 'sortLanguages',
        params: {
          country_code: this.country_code
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
     // params.bookmark = JSON.stringify(this.bookmark)
      params.route = JSON.stringify(this.$route.params)
      if (location == 'prototype') {
        response = await PrototypeService.publish('languages', params)
      } else {
        response = await PublishService.publish('languages', params)
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
        await this.getLanguages(this.$route.params)
        if (this.recnum) {
          this.localBookmark(this.recnum)
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
        // end authorization for prototype and publish
        this.ZZ = false
        if (this.$route.params.country_code == 'ZZ') {
          this.ZZ = true
        }
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in LanguagesEdit.vue:', error) // Logs out the error
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  created() {
    this.loadView()
  }
}
</script>

<style></style>
