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
import DataService from '@/services/DataService.js'
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

  created() {
    console.log('I am in Page.Vue')
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.$route.params.countryCODE
    route.language = this.$route.params.languageISO
    route.book = this.$route.params.bookNAME
    route.series = this.$route.params.bookNAME
    route.page = this.$route.params.pageFILENAME
    console.log('This is the route I sending to checkBookmark from Page.vue')
    console.log(route)
    this.$store.dispatch('checkBookmark', route)
    DataService.getPage(
      route.country,
      route.language,
      this.bookmark.book.folder,
      route.page
    )
      .then(response => {
        //  console.log('page in Page.Vue')
        // console.log(response.data) // For now, logs out the response
        this.pageText = response.data
        this.loading = false
        this.loaded = true
      })
      .catch(error => {
        this.loading = false
        console.log('There was an error:', error.response) // Logs out the error
        this.error = error.toString()
      })
  }
}
</script>
<style >
</style>


<style scoped>
.float-right {
  text-align: right;
}
</style>
