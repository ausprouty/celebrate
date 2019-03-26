<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <a v-bind:href="'/languages/' + this.bookmark.country.code">
        <img v-bind:src="appDir.library +  this.image_dir +'/journey.jpg'" class="app-img-header">
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
import NavBar from '@/components/NavBarHamburger.vue'
import ContentService from '@/services/ContentService.js'
export default {
  props: ['countryCODE', 'languageISO'],
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  components: {
    Book,
    NavBar
  },
  data() {
    return {
      library: [
        {
          id: '',
          book: '',
          title: '',
          folder: '',
          index: '',
          style: 'AU-myfriends.css',
          image: 'issues.jpg',
          format: 'series',
          instructions: ''
        }
      ],
      image_dir: '',
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
    this.error = this.loaded = null
    this.loading = true
    var ref = this
    ContentService.getLibrary(this.$route.params)
      .then(response => {
        ref.library = response.data.content.text
        ref.loading = false
        ref.loaded = true
        ref.image_dir = ref.standard.image_dir
        if (typeof ref.bookmark.language.image_dir != 'undefined') {
          console.log('USING BOOKMARK')
          ref.image_dir = ref.bookmark.language.image_dir
        }
        console.log('this.image_dir')
        console.log(ref.image_dir)
      })
      .catch(error => {
        console.log('There was an error in  bookmark Library:', error.response) // Logs out the error
        this.error = error.toString()
      })
  }
}
</script>
