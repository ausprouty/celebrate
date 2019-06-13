<template>
  <div class="preview">
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{ this.error }}</div>
    <div class="content" v-if="loaded">
      <div v-if="this.publish">
        <button class="button" @click="local_publish()">Publish</button>
      </div>
      <link rel="stylesheet" v-bind:href="'/content/' + this.bookmark.book.style">
      <div class="app-link">
        <div class="app-card -shadow">
          <div v-on:click="goBack()">
            <img
              v-bind:src="
                appDir.library +
                  this.bookmark.language.image_dir +
                  '/' +
                  this.bookmark.book.image
              "
              class="book"
            >

            <div class="book">
              <span class="bold">{{ this.bookmark.book.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <h1
        v-if="this.bookmark.page.count"
      >{{ this.bookmark.page.count }}.&nbsp; {{ this.bookmark.page.title }}</h1>
      <h1 v-else>{{ this.bookmark.page.title }}</h1>
      <p>
        <span v-html="pageText"></span>
      </p>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
    <div v-if="write">
      <button class="button" @click="editPage">Edit</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import PublishService from '@/services/PublishService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { pageMixin } from '@/mixins/PageMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, pageMixin, authorMixin],
  props: ['countryCODE', 'languageISO', 'folderNAME', 'fileNAME'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),

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
          countryCODE: this.$route.params.countryCODE,
          languageISO: this.$route.params.languageISO,
          libraryCODE: this.$route.params.libraryCODE,
          folderNAME: this.$route.params.folderNAME,
          fileNAME: this.$route.params.fileNAME,
          cssFORMATTED: clean,
          token: this.user.token
        }
      })
    },
    goBack() {
      // can not use  window.history.back() as this may lead to endless loop with edit
      if (this.bookmark.book.format == 'series') {
        this.$router.push({
          name: 'previewSeries',
          params: {
            countryCODE: this.$route.params.countryCODE,
            languageISO: this.$route.params.languageISO,
            libraryCODE: this.$route.params.libraryCODE,
            folderNAME: this.bookmark.book.name
          }
        })
      } else {
        this.$router.push({
          name: 'previewLibrary',
          params: {
            countryCODE: this.$route.params.countryCODE,
            languageISO: this.$route.params.languageISO,
            libraryCODE: this.$route.params.libraryCODE
          }
        })
      }
    },
    async local_publish() {
      var params = {}
      params.recnum = this.recnum
      params.bookmark = JSON.stringify(this.bookmark)
      var response = await PublishService.publish('page', params)
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
    async loadView() {
      try {
        await this.getPage(this.$route.params)
        this.read = this.authorize('read', this.$route.params.countryCODE)
        this.write = this.authorize('write', this.$route.params.countryCODE)
        var may_publish = this.authorize(
          'publish',
          this.$route.params.countryCODE
        )
        if (may_publish && this.recnum && this.publish_date == null) {
          this.publish = true
        }
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
<style></style>
