<template>
  <div>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <a v-bind:href="'/languages/' + this.bookmark.country.code">
        <img v-bind:src="appDir.library +  this.bookmark.language.image_dir +'/journey.jpg'" class="app-img-header">
        <img v-bind:src="appDir.root+'backbar.png'" class="app-img-header">
      </a>

      <Book v-for="book in library" :key="book.title" :book="book"/>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
  </div>
</template>


<script>
import Book from '@/components/Book.vue'
import { mapState } from 'vuex'
import DataService from '@/services/DataService.js'
export default {
  props: ['countryCODE', 'languageISO'],
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  components: {
    Book
  },
  data() {
    return {
      library: [],
      loading: false,
      loaded: null,
      error: null
    }
  },
  created() {
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    this.$store.dispatch('checkBookmark', route).then(response => {
      // it is safer to get data each time tha rely on bookmark
      DataService.getLibrary(this.countryCODE, this.languageISO)
        .then(response => {
          this.library = response.data
          this.loading = false
          this.loaded = true
        })
        .catch(error => {
          console.log(
            'There was an error in  bookmark Library:',
            error.response
          ) // Logs out the error
          this.error = error.toString()
        })
    })
  }
}
</script>
