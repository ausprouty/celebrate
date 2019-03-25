<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <link rel="stylesheet" v-bind:href="'/css/' + this.bookmark.book.style">
      <div class="app-link">
        <div class="app-card -shadow">
          <img
            v-bind:src="appDir.library + this.bookmark.language.image_dir + '/' + this.bookmark.book.image"
            class="book"
          >

          <div class="book">
            <span class="bold">{{this.bookmark.book.title}}</span>
          </div>
        </div>
      </div>

      <h1 v-if="this.bookmark.page.count">{{this.bookmark.page.count}}. {{this.bookmark.page.title}}</h1>
      <h1 v-else>{{this.bookmark.page.title}}</h1>
      <p>
        <span v-html="pageText"></span>
      </p>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarBack.vue'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME', 'pageFILENAME'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      pageText: '',
      loadinG: false,
      loading: false,
      loaded: null,
      error: null
    }
  },
  beforeCreate() {
    this.$route.params.version = 'current'
    this.$store.dispatch('checkBookmark', this.$route.params)
  },
  created() {
    console.log('PAGE VUE')
    this.error = this.loaded = null
    this.loading = true
    ContentService.getPage(this.$route.params)
      .then(response => {
        console.log('PAGE VUE - response.data')
        console.log(response.data)
        this.pageText = response.data
        this.loading = false
        this.loaded = true
      })
      .catch(error => {
        this.loading = false
        console.log('PAGE VUE - There was an error:', error.response) // Logs out the error
        this.error = error.toString()
      })
  }
}
</script>
<style >
</style>
