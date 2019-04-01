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
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button class="button" @click="sortLibrary">Sort</button>
  </div>
</template>


<script>
import Book from '@/components/BookPreview.vue'
import { mapState } from 'vuex'
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { libraryMixin } from '@/mixins/LibraryMixin.js'
export default {
  mixins: [bookMarkMixin, libraryMixin],
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
    sortLibrary() {
      this.$router.push({
        name: 'sortLibrary',
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
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      this.getLibrary()
    } catch (error) {
      console.log('There was an error in LibraryEdit.vue:', error) // Logs out the error
    }
  }
}
</script>
