<template>
  <div>
    <h1>Library for {{language}} in {{country}}</h1>
    <Book v-for="book in library" :key="book.title" :book="book"/>
  </div>
</template>


<script>
import Book from '@/components/Book.vue'
import DataService from '@/services/DataService.js'
export default {
  props: ['countryISO', 'languageISO'],
  components: {
    Book
  },
  data() {
    return {
      library: []
    }
  },
  created() {
    DataService.getLibrary(this.countryISO, this.languageISO)
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
