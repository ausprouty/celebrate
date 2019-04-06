<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Library</h1>
      <div>
       

        <div v-for="(book, index) in $v.library.$each.$iter" :key="book.code" :book="book">
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteBookForm(index)">X</div>
            <div>
              <BaseInput
                v-model="book.title.$model"
                label="Title"
                type="text"
                placeholder="Title"
                class="field"
                :class="{ error: book.title.$error }"
                @blur="book.title.$touch()"
              />
              <template v-if="book.title.$error">
                <p v-if="!book.title.required" class="errorMessage">Book Title is required</p>
              </template>
              <br>
              <br>
              <img v-bind:src="appDir.library  + image_dir  + '/' + book.image.$model" class="book">
              <br>
            

              <BaseInput
                v-model="book.image.$model"
                label="Image"
                type="text"
                placeholder="Image"
                class="field"
                :class="{ error: book.image.$error }"
                @blur="book.image.$touch()"
              />
              <template v-if="book.image.$error">
                <p v-if="!book.image.required" class="errorMessage">Book Image is required</p>
              </template>

              <BaseSelect
                label="Book"
                :options="books"
                v-model="book.book.$model"
                class="field"
                :class="{ error: book.book.$error }"
                @blur="book.book.$touch()"
              />
              <template v-if="book.book.$error">
                <p v-if="!book.book.required" class="errorMessage">Book is required</p>
              </template>

               <BaseInput
                v-model="book.folder.$model"
                label="Folder"
                type="text"
                placeholder="myfriends"
                class="field"
                :class="{ error: book.folder.$error }"
                @blur="book.folder.$touch()"
              />
              <template v-if="book.folder.$error">
                <p v-if="!book.folder.required" class="errorMessage">Folder is required</p>
              </template>

              <BaseSelect
                label="Format"
                :options="formats"
                v-model="book.format.$model"
                class="field"
                :class="{ error: book.format.$error }"
                @blur="book.format.$touch()"
              />
              <template v-if="book.format.$error">
                <p v-if="!book.format.required" class="errorMessage">Format is required</p>
              </template>

              <div v-if="book.format.$model == 'series'">
                <BaseInput
                  v-model="book.index.$model"
                  label="Index"
                  type="text"
                  placeholder="Index"
                  class="field"
                  :class="{ error:book.index.$error }"
                  @blur="book.index.$touch()"
                />
                <template v-if="book.index.$error">
                  <p v-if="!book.index.required" class="errorMessage">Index is required</p>
                </template>

                <BaseInput
                  v-model="book.style.$model"
                  label="Style Sheet"
                  type="text"
                  placeholder="AU-myfriends.css"
                  class="field"
                  :class="{ error: book.style.$error }"
                  @blur="book.style.$touch()"
                />
                <template v-if="book.style.$error">
                  <p v-if="!book.style.required" class="errorMessage">Style Sheet is required</p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
       <button class="button" @click="addNewBookForm">New Book</button>
      <div v-if="!$v.$anyError">
        <button class="button red" @click="saveForm">Save Changes</button>
      </div>
      <div v-if="$v.$anyError">
        <button class="button grey">Disabled</button>
        <p v-if="$v.$anyError" class="errorMessage">Please fill out the required field(s).</p>
      </div>
    </div>
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
  data() {
    return {
      library: {
        id: '',
        book: '',
        title: '',
        folder: '',
        index: '',
        style: '',
        image: '',
        format: ''
      },
      formats: ['series', 'page'],
      books: ['issues', 'basics', 'community', 'firststeps', 'compass', 'about']
    }
  },
  validations: {
    library: {
      required,
      $each: {
        book: { required },
        title: { required },
        folder: { required },
        index: '',
        style: { required },
        image: { required },
        format: { required }
      }
    }
  },
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
