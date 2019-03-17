<template>
  <div class="preview">
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
          />

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
    <button class="button" @click="editPage">Edit</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarAdmin.vue'
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
  methods: {
    editPage() {
      this.$router.push({
        name: 'editPage',
        params: {
          countryCODE: this.countryCODE,
          languageISO: this.languageISO,
          bookNAME: this.bookNAME,
          pageFILENAME: this.pageFILENAME
        }
      })
    },
    goBack() {
      window.history.back()
    }
  },

  created() {
    console.log('I am in Page.Vue')
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    route.book = this.bookNAME
    route.series = this.bookNAME
    route.page = this.pageFILENAME
    route.revison = 'latest'
    this.$store.dispatch('checkBookmark', route)
    var ref = this
    ContentService.getPage(
      this.countryCODE,
      this.languageISO,
      this.bookmark.book.folder,
      this.pageFILENAME
    )
      .then(response => {
        ref.pageText = response.data
        ref.loading = false
        ref.loaded = true
      })
      .catch(error => {
        ref.loading = false
        console.log('There was an error:', error.response) // Logs out the error
        ref.error = error.toString()
      })
  }
}
</script>
<style >
</style>
