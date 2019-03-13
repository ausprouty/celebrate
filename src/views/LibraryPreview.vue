<template>
  <div class="preview">
    <NavBar/>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <a v-bind:href="'/languages/' + this.bookmark.country.code">
        <img v-bind:src="appDir.library +  this.image_dir +'/journey.jpg'" class="app-img-header">
      </a>
      <p> {{this.image_dir}} image directory </p>

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
    route.revison = 'latest'
    this.$store.dispatch('checkBookmark', route)
    ContentService.getLibrary(route.country, route.language, this.revision)
      .then(response => {
        console.log('LIBRARY PREVIEW - response from edit service')
        console.log(response.data)
        if (!response.data.content) {
          console.log('LIBRARY PREVIEW - I am going to content for library')
          ContentService.getLibrary(route.country, route.language).then(
            response => {
              ref.library = JSON.parse(response.text.data)
              if (typeof ref.bookmark.language != 'undefined') {
                console.log('LIBRARY PREVIEW - using bookmark')
                console.log(ref.bookmark.language.image_dir)
                ref.image_dir = ref.bookmark.language.image_dir
                console.log(ref.image_dir)
              } else {
                console.log('LIBRARY PREVIEW -using standard directory')
                ref.image_dir = ref.standard.image_dir
              }
              ref.loading = false
              ref.loaded = true
            }
          )
        } else {
          console.log('LIBRARY PREVIEW - putting edited content into library')
          ref.library = JSON.parse(response.data.content.text)
          ref.image_dir = ref.bookmark.language.image_dir
          console.log(ref.library)
          ref.loading = false
          ref.loaded = true
        }
      })
      .catch(error => {
        console.log('LIBRARY PREVIEW - There was an error in  bookmark Library:', error.response) // Logs out the error
        this.error = error.toString()
      })
  }
}
</script>
