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
            <form @submit.prevent="saveForm">
              <BaseInput
                v-model="book.title"
                label="Title"
                type="text"
                placeholder="Title"
                class="field"
              />
              <br>
              <br>
              <img v-bind:src="appDir.library  + image_dir  + '/' + book.image" class="book">
              <br>
              <BaseInput
                v-model="book.image"
                label="Image"
                type="text"
                placeholder="myfriends"
                class="field"
              />

              <span>Book:</span>
              <select v-model="book.book">
                <option value="issues">Issues</option>
                <option value="basics">Basics</option>
                <option value="community">Community</option>
                <option value="firststeps">First Steps</option>
                <option value="compass">Compass</option>
                <option value="about">About</option>
              </select>
              <BaseInput
                v-model="book.folder"
                label="Folder"
                type="text"
                placeholder="myfriends"
                class="field"
              />
              <span>Format:</span>
              <select v-model="book.format">
                <option value="series">series</option>
                <option value="page">page</option>
              </select>
              <div v-if="book.format == 'series'">
                <BaseInput
                  v-model="book.index"
                  label="Index"
                  type="text"
                  placeholder="basics-chapters"
                  class="field"
                />
              </div>

              <BaseInput
                v-model="book.style"
                label="Language 3 letter ISOStyle Sheet"
                type="text"
                placeholder="AU-myfriends.css"
                class="field"
              />
            </form>
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
import { required } from 'vuelidate/lib/validators'
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
    async saveForm() {
      try {
        var valid = ContentService.validate(this.library)
        this.content.text = JSON.stringify(valid)
        this.content.filename = 'library'
        this.content.filetype = 'json'
        this.content.country_iso = this.$route.params.countryCODE
        this.content.language_iso = this.$route.params.languageISO
        this.$store.dispatch('newBookmark', 'clear')
        await ContentService.createContentData(this.content)
        this.$router.push({
          name: 'previewLibrary',
          params: {
            countryCODE: this.$route.params.countryCODE,
            languageISO: this.$route.params.languageISO
          }
        })
      } catch (error) {
        console.log('LIBRARY EDIT There was an error ', error) //
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      await this.getLibrary()
      this.loaded = true
      this.loading = false
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
