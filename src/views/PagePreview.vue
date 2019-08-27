<template>
  <div class="preview" v-bind:class="this.bookmark.language.rldir">
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
      <link rel="stylesheet" v-bind:href="this.bookmark.book.style" />
      <div class="app-link">
        <div class="app-card -shadow">
          <div v-on:click="goBack()">
            <img
              v-bind:src="this.image_navigation.image"
              v-bind:class="this.image_navigation_class"
            />
            <span
              class="title"
              v-bind:class="this.bookmark.language.rldir"
              v-if="this.show_navigation_title"
              >{{ this.navigation_title }}</span
            >
          </div>
        </div>
      </div>
      <div v-if="this.show_page_title">
        <h1 v-if="this.bookmark.page.count">
          {{ this.bookmark.page.count }}.&nbsp; {{ this.bookmark.page.title }}
        </h1>
        <h1 v-else>{{ this.bookmark.page.title }}</h1>
      </div>
      <div v-if="this.show_page_image">
        <img
          v-bind:src="
            appDir.library + this.image_page_dir + '/' + this.image_page
          "
          v-bind:class="this.image_page_class"
        />
      </div>
      <div>
        <span v-html="pageText"></span>
      </div>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
    <div v-if="this.write">
      <button class="button" @click="editPage">Edit</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PrototypeService from '@/services/PrototypeService.js'
import PublishService from '@/services/PublishService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { pageMixin } from '@/mixins/PageMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, pageMixin, authorMixin],
  props: ['country_code', 'language_iso', 'folder_name', 'filename'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      prototype_text: 'Prototype'
    }
  },
  methods: {
    editPage() {
      var css = this.bookmark.page.style
        ? this.bookmark.page.style
        : this.bookmark.book.style
      var clean = css.replace(/\//g, '@')
      console.log('here is clean')
      console.log(clean)
      this.$router.push({
        name: 'editPage',
        params: {
          country_code: this.$route.params.country_code,
          language_iso: this.$route.params.language_iso,
          library_code: this.$route.params.library_code,
          folder_name: this.$route.params.folder_name,
          filename: this.$route.params.filename,
          cssFORMATTED: clean,
          token: this.user.token
        }
      })
    },
    goBack() {
      // can not use  window.history.back() as this may lead to endless loop with edit
      if (this.bookmark.book.format == 'series') {
        console.log('goBack in series')
        this.$router.push({
          name: 'previewSeries',
          params: {
            country_code: this.$route.params.country_code,
            language_iso: this.$route.params.language_iso,
            library_code: this.$route.params.library_code,
            folder_name: this.$route.params.folder_name
          }
        })
      } else {
        console.log('goBack Page')
        this.$router.push({
          name: 'previewLibrary',
          params: {
            country_code: this.$route.params.country_code,
            language_iso: this.$route.params.language_iso,
            library_code: this.$route.params.library_code
          }
        })
      }
    },
    async localPublish(location) {
      var response = null
      var params = {}
      params.recnum = this.recnum
      //params.bookmark = JSON.stringify(this.bookmark)
      params.route = JSON.stringify(this.$route.params)
      if (location == 'prototype') {
        response = await PrototypeService.publish('page', params)
      } else {
        response = await PublishService.publish('page', params)
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
        await this.getPage(this.$route.params)
        if (this.recnum) {
          this.localBookmark(this.recnum)
        }
        this.read = this.authorize('read', this.$route.params.country_code)
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
      } catch (error) {
        console.log('There was an error in Page.vue:', error) // Logs out the error
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
<style>
.title {
  font-weight: bold;
  padding-left: 20px;
  position: absolute;
  padding-top: 20px;
  font-size: 24px;
}
.title.rtl {
  padding-left: 0px;
  padding-right: 20px;
}
li.rtl {
  text-align: right;
}
</style>
