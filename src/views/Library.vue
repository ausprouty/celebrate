<template>
  <div>
        <a v-bind:href ="'/languages/' + this.bookmark.country.code" >
        <img
          v-bind:src="appDir.library + this.bookmark.language.image_dir + '/journey.jpg'"
          class="app-img-header">
           <img v-bind:src="appDir.root+'backbar.png'" class="app-img-header">
           </a>
        

    <Book v-for="book in library" :key="book.title" :book="book"/>
    <div class="version">
      <p class="version">Version 1.01</p>
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
      library: []
    }
  },
  created() {
    /* Update bookmark based on this route (for people to select URL from another source)
       Bookmark stores current Country and Library and all specialized info for that library
    */
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    console.log('route in Library is')
    console.log(route)
    this.$store
      .dispatch('checkBookmark', route)
      .then(responseBookmark => {
        console.log('responseBookmark in Library')
        console.log(responseBookmark)
        this.library = responseBookmark.library
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>
