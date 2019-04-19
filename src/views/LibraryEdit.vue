<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{this.error_message}}</div>
    <div class="content" v-if="loaded">
      <div v-if="!this.authorized">
        <p>You have stumbled into a restricted page. Sorry I can not show it to you now</p>
      </div>
      <div v-if="this.authorized">
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

                <div v-if="images">
                  <br>
                  <br>
                  <img
                    v-bind:src="appDir.library  + image_dir  + '/' + book.image.$model"
                    class="book"
                  >
                  <br>
                  <BaseSelect
                    label="Image"
                    :options="images"
                    v-model="book.image.$model"
                    class="field"
                    :class="{ error: book.image.$error }"
                    @blur="book.image.$touch()"
                  />
                  <template v-if="book.image.$error">
                    <p v-if="!book.image.required" class="errorMessage">Book Imae is required</p>
                  </template>
                </div>
                <div>
                  <label>
                    <input
                      type="file"
                      v-bind:id="book.title.$model"
                      ref="image"
                      v-on:change="handleImageUpload(book.title.$model)"
                    >
                  </label>
                </div>

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
                    label="Index Filename"
                    type="text"
                    placeholder="Index"
                    class="field"
                    :class="{ error:book.index.$error }"
                    @blur="book.index.$touch()"
                  />
                  <template v-if="book.index.$error">
                    <p v-if="!book.index.required" class="errorMessage">Index is required</p>
                  </template>
                </div>
                <BaseSelect
                  label="Book"
                  :options="mybooks"
                  v-model="book.book.$model"
                  class="field"
                  :class="{ error: book.book.$error }"
                  @blur="book.book.$touch()"
                />
                <template v-if="book.book.$error">
                  <p v-if="!book.book.required" class="errorMessage">Book is required</p>
                </template>
                <div>
                  <p>
                    <a class="black" @click="createBook()">Create new Book</a>
                  </p>
                </div>

                <BaseSelect
                  label="Folder"
                  :options="folders"
                  v-model="book.folder.$model"
                  class="field"
                  :class="{ error: book.folder.$error }"
                  @blur="book.folder.$touch()"
                />
                <template v-if="book.folder.$error">
                  <p v-if="!book.folder.required" class="errorMessage">Folder is required</p>
                </template>
                <div>
                  <p>
                    <a class="black" @click="createFolder()">Create new Folder</a>
                  </p>
                </div>

                <BaseSelect
                  label="Style Sheet"
                  :options="styles"
                  v-model="book.style.$model"
                  class="field"
                  :class="{ error: book.style.$error }"
                  @blur="book.style.$touch()"
                />
                <template v-if="book.style.$error">
                  <p v-if="!book.style.required" class="errorMessage">Style is required</p>
                </template>
                <label>
                  Add new stylesheet&nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type="file"
                    v-bind:id="book.title.$model"
                    ref="style"
                    v-on:change="handleStyleUpload(book.title.$model)"
                  >
                </label>

                <BaseSelect
                  label="Template"
                  :options="templates"
                  v-model="book.template.$model"
                  class="field"
                  :class="{ error: book.template.$error }"
                  @blur="book.template.$touch()"
                />
                <label>
                  Add new template&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type="file"
                    v-bind:id="book.title.$model"
                    ref="template"
                    v-on:change="handleTemplateUpload(book.title.$model)"
                  >
                </label>
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
      <div v-if="!this.authorized">
        <p>
          You need to
          <a href="/login">login to make changes</a> here
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { libraryMixin } from '@/mixins/LibraryMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
import { required } from 'vuelidate/lib/validators'
export default {
  mixins: [bookMarkMixin, libraryMixin, authorMixin],
  components: {
    NavBar
  },
  props: ['countryCODE', 'languageISO'],
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard', 'books']),
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
        format: '',
        template: ''
      },
      formats: ['page', 'series'],
      images: null,
      folders: null,
      styles: null,
      mybooks: null,
      templates: null,
      authorized: false
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
        format: { required },
        template: ''
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
        format: 'series',
        template: 'AU-myfriends'
      })
    },
    createFolder() {},
    deleteBookForm(index) {
      this.library.splice(index, 1)
    },
    handleImageUpload(code) {
      console.log('code in handle:' + code)
      var checkfile = ''
      var i = 0
      var arrayLength = this.$refs.file.length
      for (i = 0; i < arrayLength; i++) {
        checkfile = this.$refs.file[i]['files']
        if (checkfile.length == 1) {
          // console.log(checkfile)
          //  console.log(checkfile[0])
          var type = AuthorService.typeImage(checkfile[0])
          if (type) {
            var params = {}
            params.directory = 'flag'
            params.name = code
            AuthorService.storeImage(params, checkfile[0])

            for (i = 0; i < arrayLength; i++) {
              checkfile = this.$v.countries.$each[i]
              if (checkfile.code.$model == code) {
                this.$v.countries.$each[i].$model.image = 'default.png'
                this.$v.countries.$each[i].$model.image = code + type
                console.log(' I reset ' + i)
                console.log(this.$v.countries.$each)
              }
            }
          }
        }
      }
    },
    handleStyleUpload(code) {
      console.log('code in handle Style:' + code)
      var checkfile = ''
      var i = 0
      var arrayLength = this.$refs.style.length
      console.log(this.$refs.style)
      for (i = 0; i < arrayLength; i++) {
        checkfile = this.$refs.style[i]['files']
        if (checkfile.length == 1) {
          console.log(checkfile[0])
          var type = AuthorService.typeStyle(checkfile[0])
          if (type) {
            console.log(checkfile)
            var params = {}
            params.file = checkfile[0]
            params.country = this.$route.params.countryCODE
            type = AuthorService.createStyle(params)
            if (type) {
              console.log(type)
            }
          } else {
            console.log('not a style sheet')
          }
        }
      }
    },
    handleTemplateUpload(code) {
      console.log('code in handle Template:' + code)
      var checkfile = ''
      var i = 0
      var arrayLength = this.$refs.template.length
      console.log(this.$refs.template)
      for (i = 0; i < arrayLength; i++) {
        checkfile = this.$refs.template[i]['files']
        if (checkfile.length == 1) {
          console.log(checkfile[0])
          var type = AuthorService.typeTemplate(checkfile[0])
          if (type) {
            console.log('type ok')
            console.log(checkfile)
            var params = {}
            params.file = checkfile[0]
            params.country = this.$route.params.countryCODE
            params.language = this.$route.params.languageISO
            type = AuthorService.createTemplate(params)
            if (type) {
              console.log(type)
            }
          } else {
            console.log('not a template')
          }
        }
      }
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
        valid = await AuthorService.createContentData(this.content)
        this.$router.push({
          name: 'previewLibrary',
          params: {
            countryCODE: this.$route.params.countryCODE,
            languageISO: this.$route.params.languageISO
          }
        })
      } catch (error) {
        console.log('LIBRARY EDIT There was an error ', error)
        this.error = true
        this.loaded = false
        this.error_message = valid.data.message
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      await this.getLibrary()
      // console.log('after get Libary')
      var param = {}
      param.menu = this.bookmark.language.image_dir
      var img = await AuthorService.getImages(param)
      if (img) {
        this.images = img
      }
      param.country_code = this.$route.params.countryCODE
      param.language_iso = this.$route.params.languageISO
      var folder = await AuthorService.getFolders(param)
      if (folder) {
        this.folders = folder
      }
      var style = await AuthorService.getStyles(param)
      if (style) {
        this.styles = style
      }
      var template = await AuthorService.getTemplates(param)
      if (template) {
        this.templates = template
      }
      var booklist = await AuthorService.getTemplates(param)
      if (booklist) {
        this.mybooks = booklist
      } else {
        this.mybooks = this.books
      }
      this.authorized = this.authorize('write')
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
