<template>
  <div class="preview">
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
    <button class="button" @click="editLibrary">Edit</button>
  </div>
</template>


<script>
import Book from '@/components/BookPreview.vue'
import { mapState } from 'vuex'
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import EditService from '@/services/EditService.js'
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
  methods: {
    editLibrary() {
      this.$router.push({
        name: 'editLibrary',
        params: {
          countryCODE: this.countryCODE,
          languageISO: this.languageISO
        }
      })
    },
    goBack() {
      window.history.back()
    }
  },
  created() {
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    var ref = this
    route.country = this.countryCODE
    route.language = this.languageISO
    this.$store.dispatch('checkBookmark', route)
    EditService.getLibrary(route.country, route.language, this.revision)
      .then(response => {
        console.log('response from edit service')
        console.log(response.data)
        if (!response.data.content) {
          console.log('I am going to content for library')
          ContentService.getLibrary(route.country, route.language).then(
            response => {
              ref.library = response.data
              if (typeof ref.bookmark.language != 'undefined') {
                console.log('USING BOOKMARK')
                console.log(ref.bookmark.language)
                this.image_dir = ref.bookmark.language.image_dir
                console.log(ref.image_dir)
              } else {
                console.log('USING STANDARD')
                ref.image_dir = ref.standard.image_dir
              }
              ref.loading = false
              ref.loaded = true
            }
          )
        } else {
          console.log('putting edited content into library')
          ref.library = JSON.parse(response.data.content.text)
          console.log(ref.library)
          ref.loading = false
          ref.loaded = true
        }
      })
      .catch(error => {
        console.log('There was an error in  bookmark Library:', error.response) // Logs out the error
        this.error = error.toString()
      })
  }
}
</script>
