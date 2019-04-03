<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Library</h1>
      <div>
        <button class="button" @click="addNewBookForm">New Book</button>
        <div v-for="(book, index) in library" :key="book.code" :book="book">
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteBookForm(index)">X</div>
            <h4 class="card-title">Book #{{index}}</h4>
            <div class="form">
              <span>Title:</span>
              <input type="text" class="form-control mb-2" placeholder="Title" v-model="book.title">
              <br>
              <br>
              <img v-bind:src="appDir.library  + image_dir  + '/' + book.image" class="book">
              <br>
              <span>Image:</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="myfriends"
                v-model="book.image"
              >

              <span>Book:</span>
              <select v-model="book.book">
                <option value="issues">Issues</option>
                <option value="basics">Basics</option>
                <option value="community">Community</option>
                <option value="firststeps">First Steps</option>
                <option value="compass">Compass</option>
                <option value="about">About</option>
              </select>

              <span>Folder:</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="myfriends"
                v-model="book.folder"
              >
              <span>Format:</span>
              <select v-model="book.format">
                <option value="series">series</option>
                <option value="page">page</option>
              </select>
              <div v-if="book.format == 'series'">
                <span>Index</span>
                <input
                  type="text"
                  class="form-control mb-2"
                  placeholder="basics-chapters.json"
                  v-model="book.index"
                >
              </div>
              <span>Style Sheet</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="AU-myfriends.css"
                v-model="book.style"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="button" @click="saveForm">Save</button>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { libraryMixin } from '@/mixins/LibraryMixin.js'
export default {
  mixins: [bookMarkMixin, libraryMixin],
  components: {
    NavBar
  },
  props: ['countryCODE', 'languageISO'],
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  
  methods: {
    addNewBookForm() {
      this.library.push({
        id: '',
        book: '',
        title: '',
        folder: '',
        index: '',
        style: 'AU-myfriends.css',
        image: 'issues.jpg',
        format: 'series'
      })
    },
    deleteBookForm(index) {
      this.library.splice(index, 1)
    },
    saveForm() {
      console.log(this.content)
      this.content.text = JSON.stringify(this.library)
      this.content.filename = 'library'
      this.content.filetype = 'json'
      this.content.country_iso = this.$route.params.countryCODE
      this.content.language_iso = this.$route.params.languageISO
      var contentForm = ContentService.toFormData(this.content)
      var ref = this
      // clear bookmark because we are editing details
      this.$store.dispatch('newBookmark', 'clear')
      //
      ContentService.createContentData(contentForm).then(function(response) {
        if (response.data.error) {
          ref.errorMessage = response.data.message
        } else {
          // this.successMessage = response.data.message
          //ref.getCountries()
          ref.$router.push({
            name: 'previewLibrary',
            params: {
              countryCODE: ref.$route.params.countryCODE,
              languageISO: ref.$route.params.languageISO
            }
          })
        }
      })
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      this.getLibrary()
    } catch (error) {
      console.log('There was an error in Library.vue:', error) // Logs out the error
    }
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
