<template>
  <div>
    <Book v-for="book in library" :key="book.title" :book="book"/>
    <div class="version">
      <p class="version">Version 1.01</p>
    </div>
  </div>
</template>


<script>
import Book from '@/components/Book.vue'
import DataService from '@/services/DataService.js'
export default {
  props: ['countryCODE', 'languageISO'],
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
    this.$store.dispatch('checkBookmark', route)
    DataService.getLibrary(this.countryCODE, this.languageISO)
      .then(response => {
        console.log('library in Library.Vue')
        console.log(response.data) // For now, logs out the response
        this.library = response.data
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>
