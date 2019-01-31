<template>
  <div>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <a v-bind:href="'/languages/' + this.bookmark.country.code">
        <img
          v-bind:src="appDir.library + this.bookmark.language.image_dir + '/journey.jpg'"
          class="app-img-header"
        >
        <img v-bind:src="appDir.root+'backbar.png'" class="app-img-header">
      </a>

      <Book v-for="book in this.bookmark.library" :key="book.title" :book="book"/>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
  </div>
</template>


<script>
import Book from '@/components/Book.vue'
import DataService from '@/services/DataService.js'
import BookmarkService from '@/services/Bookmark.js'
import { mapState } from 'vuex'
export default {
  props: ['countryCODE', 'languageISO'],
  computed: mapState(['appDir', 'cssURL']),
  components: {
    Book
  },
  data() {
    return {
      bookmark: null,
      loading: false,
      loaded: null,
      error: null
    }
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData'
  },
  methods: {
    fetchData() {
      this.error = this.loaded = null
      this.loading = true
      var route = {}
      route.country = this.countryCODE
      route.language = this.languageISO
      var myBookmark = {}

      DataService.getCountries()
        .then(response => {
          myBookmark.country = {}
          var length = response.data.length
          for (var i = 0; i < length; i++) {
            if (response.data[i].code == route.country) {
              myBookmark.country = response.data[i]
            }
          }
        })
        .catch(error => {
          console.log('There was an error in  bookmarkCountry:', error.response) // Logs out the error
          this.error = err.toString()
        })

      DataService.getLanguages(route.country)
        .then(response => {
          myBookmark.language = {}
          var length = response.data.length
          for (var i = 0; i < length; i++) {
            if (response.data[i].iso == route.language) {
              myBookmark.language = response.data[i]
            }
          }
        })
        .catch(error => {
          console.log(
            'There was an error in  bookmarkLanguage:',
            error.response
          ) // Logs out the error
          this.error = err.toString()
        })

      DataService.getLibrary(route.country, route.language)
        .then(response => {
          myBookmark.library = response.data
        })
        .catch(error => {
          console.log(
            'There was an error in  bookmarkLanguage:',
            error.response
          ) // Logs out the error
          this.error = err.toString()
        })

      this.bookmark = myBookmark

      this.loaded = true
      this.loading = true
      console.log('this  this Bookmark in Library View')
      console.log(this.bookmark)
    }
  }
}
</script>








created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData'
  },
  methods: {
    fetchData() {
      this.error = this.loaded = null
      this.loading = true
      var route = {}
      route.country = this.countryCODE
      route.language = this.languageISO
      var myBookmark = {}

      DataService.getCountries()
        .then(response => {
          myBookmark.country = {}
          var length = response.data.length
          for (var i = 0; i < length; i++) {
            if (response.data[i].code == route.country) {
              myBookmark.country = response.data[i]
            }
          }
          DataService.getLanguages(route.country).then(response => {
            myBookmark.language = {}
            var length = response.data.length
            for (var i = 0; i < length; i++) {
              if (response.data[i].iso == route.language) {
                myBookmark.language = response.data[i]
              }
            }
            DataService.getLibrary(route.country, route.language).then(
              response => {
                myBookmark.library = response.data
                this.bookmark = myBookmark
                this.loaded = true
                this.loading = false
                console.log('this  this Bookmark in Library View')
                console.log(this.bookmark)
              }
            )
          })
        })
        .catch(error => {
          console.log(
            'There was an error in  bookmarkLanguage:',
            error.response
          ) // Logs out the error
          this.error = err.toString()
        })
    }
  }
