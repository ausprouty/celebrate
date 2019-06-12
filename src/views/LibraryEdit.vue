<template>
  <div>
    <NavBar />
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">
      There was an error... {{ this.error_message }}
    </div>
    <div class="content" v-if="loaded">
      <div v-if="!this.authorized">
        <p>
          You have stumbled into a restricted page. Sorry I can not show it to
          you now
        </p>
        <p>
          You need to
          <a href="/login">login to make changes</a> here
        </p>
      </div>
      <div v-if="this.authorized">
        <h1>Library</h1>
        <div v-if="images">
          <img
            v-bind:src="appDir.library + image_dir + '/' + this.image"
            class="header"
          />
          <br />
        </div>
        <BaseSelect
          label="Image"
          :options="images"
          v-model="image"
          class="field"
        />
      </div>
      <div v-if="image_permission">
        <label>
          Add new Image&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="file"
            v-bind:id="image"
            ref="imageHeader"
            v-on:change="handleHeaderUpload(image)"
          />
        </label>
      </div>
      <div>
        <hr />
      </div>
      <div>
        <button class="button" @click="publishAll">
          Select ALL to publish?
        </button>
      </div>
      <div
        v-for="(book, index) in $v.library.$each.$iter"
        :key="book.code"
        :book="book"
      >
        <div
          class="app-card -shadow"
          v-bind:class="{ notpublished: !book.publish.$model }"
        >
          <div
            class="float-right"
            style="cursor:pointer"
            @click="deleteBookForm(index)"
          >
            X
          </div>
          <div>
            <BaseInput
              v-model="book.id.$model"
              label="Book ID"
              type="text"
              placeholder="ID"
              class="field"
              :class="{ error: book.id.$error }"
              @blur="book.id.$touch()"
            />
            <BaseInput
              v-model="book.title.$model"
              label="Book Title"
              type="text"
              placeholder="Title"
              class="field"
              :class="{ error: book.title.$error }"
              @blur="book.title.$touch()"
            />
            <template v-if="book.title.$error">
              <p v-if="!book.title.required" class="errorMessage">
                Book Title is required
              </p>
            </template>

            <BaseSelect
              label="International Title"
              :options="booklist"
              v-model="book.name.$model"
              class="field"
              :class="{ error: book.name.$error }"
              @blur="book.name.$touch()"
            />
          </div>
          <div>
            <p>
              <a class="black" @click="createBook(book.name.$model)"
                >Create new International Title</a
              >
            </p>
          </div>
          <div
            v-bind:id="book.title.$model"
            v-bind:class="{ hidden: isHidden }"
          >
            <BaseInput
              label="New International Title"
              v-model="book.name.$model"
              type="text"
              placeholder="international title"
              class="field"
            />
            <button class="button" @click="addNewBookTitle(book.title.$model)">
              Save International Title
            </button>
          </div>
          <div v-if="images">
            <div v-if="book.image.$model">
              <img
                v-bind:src="
                  appDir.library + image_dir + '/' + book.image.$model
                "
                class="book"
              />
              <br />
            </div>
            <BaseSelect
              label="Image"
              :options="images"
              v-model="book.image.$model"
              class="field"
              :class="{ error: book.image.$error }"
              @blur="book.image.$touch()"
            />
            <template v-if="book.image.$error">
              <p v-if="!book.image.required" class="errorMessage">
                Image is required
              </p>
            </template>
          </div>
          <div v-if="image_permission">
            <label>
              Add new Image&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="file"
                v-bind:id="book.name.$model"
                ref="image"
                v-on:change="handleImageUpload(book.name.$model)"
              />
            </label>
          </div>
          <div>
            <BaseSelect
              label="Format"
              :options="formats"
              v-model="book.format.$model"
              class="field"
              :class="{ error: book.format.$error }"
              @blur="book.format.$touch()"
            />
            <template v-if="book.format.$error">
              <p v-if="!book.format.required" class="errorMessage">
                Format is required
              </p>
            </template>
          </div>
          <div>
            <BaseSelect
              label="Style Sheet"
              :options="styles"
              v-model="book.style.$model"
              class="field"
              :class="{ error: book.style.$error }"
              @blur="book.style.$touch()"
            />
            <template v-if="book.style.$error">
              <p v-if="!book.style.required" class="errorMessage">
                Style is required
              </p>
            </template>
            <template v-if="style_error">
              <p class="errorMessage">Only .css files may be uploaded</p>
            </template>

            <label>
              Add new stylesheet&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="file"
                v-bind:id="book.title.$model"
                ref="style"
                v-on:change="handleStyleUpload(book.title.$model)"
              />
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
              />
            </label>
            <template v-if="template_error">
              <p class="errorMessage">
                Only .html files may be uploaded as templates
              </p>
            </template>
            <button class="button yellow" @click="createTemplate">
              Create Template
            </button>
            <br />
            <br />
            <input
              type="checkbox"
              id="checkbox"
              v-model="book.publish.$model"
            />
            <label for="checkbox">
              <h2>Publish?</h2>
            </label>
          </div>
        </div>
      </div>
      <div>
        <button class="button" @click="addNewBookForm">New Book</button>
        <div v-if="!$v.$anyError">
          <button class="button red" @click="saveForm">Save Changes</button>
        </div>
        <div v-if="$v.$anyError">
          <button class="button grey">Disabled</button>
          <p v-if="$v.$anyError" class="errorMessage">
            Please fill out the required field(s).
          </p>
        </div>
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
  props: ['countryCODE', 'languageISO', 'fileFILENAME'],
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard', 'books']),
  data() {
    return {
      library: {
        name: '',
        folder: '',
        format: '',
        id: '',
        image: '',
        index: '',
        new_book: '',
        style: '',
        publish: '',
        template: '',
        title: ''
      },
      formats: ['page', 'series'],
      images: '',
      folders: '',
      styles: '',
      booklist: '',
      templates: '',
      authorized: false,
      image_permission: false,
      isHidden: true,
      image: 'withFriends.png',
      style_error: false,
      template_error: false
    }
  },
  validations: {
    library: {
      required,
      $each: {
        id: { required },
        name: { required },
        title: { required },
        style: { required },
        image: { required },
        format: { required },
        template: '',
        publish: ''
      }
    }
  },
  methods: {
    addNewBookForm() {
      this.library.push({
        id: '',
        name: '',
        title: '',
        style: '',
        image: '',
        format: '',
        template: '',
        publish: ''
      })
    },
    addNewBookTitle(title) {
      console.log(title)
      this.booklist = []
      var change = this.$v.library.$model
      var arrayLength = change.length
      for (var i = 0; i < arrayLength; i++) {
        this.booklist.push(this.$v.library.$model[i].book)
      }
      this.isHidden = true
    },
    createBook(title) {
      console.log(title)
      this.isHidden = false
    },
    publishAll() {
      var arrayLength = this.library.length
      console.log(' Item count:' + arrayLength)
      for (var i = 0; i < arrayLength; i++) {
        this.$v.library.$each.$iter[i].publish.$model = true
      }
    },
    async createFolder(folder) {
      console.log(folder)
      var params = {}
      params.country_code = this.$route.params.countryCODE
      params.language_iso = this.$route.params.languageISO
      params.folder = folder.toLowerCase()
      AuthorService.createContentFolder(params)
      this.folders = await AuthorService.getFoldersContent(params)
    },
    createTemplate() {
      this.$router.push({
        name: 'createTemplate',
        params: {
          countryCODE: this.$route.params.countryCODE,
          languageISO: this.$route.params.languageISO
        }
      })
    },

    deleteBookForm(index) {
      this.library.splice(index, 1)
    },
    handleImageUpload(code) {
      console.log('handleImageUpload: ' + code)
      var checkfile = {}
      var i = 0
      var arrayLength = this.$refs.image.length
      for (i = 0; i < arrayLength; i++) {
        checkfile = this.$refs.image[i]['files']
        if (checkfile.length == 1) {
          // console.log(checkfile)
          //  console.log(checkfile[0])
          var type = AuthorService.typeImage(checkfile[0])
          if (type) {
            var params = {}
            params.directory = 'content/' + this.bookmark.language.image_dir
            params.name = code
            AuthorService.storeImage(params, checkfile[0])
            for (i = 0; i < arrayLength; i++) {
              checkfile = this.$v.library.$each[i]
              if (checkfile.$model.book == code) {
                this.$v.library.$each[i].$model.image = code + type
              }
            }
            this.saveForm()
            this.showForm()
          }
        }
      }
    },
    handleHeaderUpload(code) {
      console.log('handleImageUpload: ' + code)
      var checkfile = {}
      checkfile = this.$refs.imageHeader['files']
      if (checkfile.length == 1) {
        console.log(checkfile)
        console.log(checkfile[0])
        var type = AuthorService.typeImage(checkfile[0])
        if (type) {
          var params = {}
          params.directory = 'content/' + this.bookmark.language.image_dir
          params.name = code
          console.log(params)
          AuthorService.storeImage(params, checkfile[0])
          this.header_image = code
          this.saveForm()
          this.showForm()
        }
      }
    },
    async handleStyleUpload(code) {
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
            params.country_code = this.$route.params.countryCODE
            type = await AuthorService.createStyle(params)
            var style = await AuthorService.getStyles(params)
            if (style) {
              this.styles = style
              this.style_error = false
            }
          } else {
            this.style_error = true
          }
        }
      }
    },
    async handleTemplateUpload(code) {
      console.log('code in handle Template:' + code)
      var checkfile = ''
      var i = 0
      var arrayLength = this.$refs.template.length
      console.log(this.$refs.template)
      for (i = 0; i < arrayLength; i++) {
        checkfile = this.$refs.template[i]['files']
        if (checkfile.length == 1) {
          console.log(' i is ' + i)
          console.log(checkfile[0])
          var book = this.library[i]
          var type = AuthorService.typeTemplate(checkfile[0])
          if (type) {
            console.log('type ok')
            console.log(checkfile)
            var params = {}
            params.file = checkfile[0]
            params.country_code = this.$route.params.countryCODE
            params.language_iso = this.$route.params.languageISO
            params.folder = book.folder
            console.log(params)
            type = await AuthorService.createTemplate(params)
            if (type) {
              var template = await AuthorService.getTemplates(params)
              if (template) {
                this.templates = template
                console.log(template)
                this.template_error = false
              }
            }
          } else {
            this.template_error = true
          }
        }
      }
    },
    async saveForm() {
      try {
        // create index files
        var check = ''
        var params = {}
        params.country_code = this.$route.params.countryCODE
        params.language_iso = this.$route.params.languageISO
        var arrayLength = this.library.length
        for (var i = 0; i < arrayLength; i++) {
          check = this.library[i]
          if (check.format == 'series') {
            params.folder = check.folder
            params.index = check.index + '.json'
            AuthorService.createSeriesIndex(params)
          }
        }
        // update library file
        var output = {}
        output.library = this.library
        output.image = this.image
        output.text = this.text
        var valid = ContentService.validate(output)
        this.content.text = JSON.stringify(valid)
        this.content.filename = this.$route.params.fileFILENAME
        this.content.filetype = 'json'
        this.content.country_code = this.$route.params.countryCODE
        this.content.language_iso = this.$route.params.languageISO
        this.$store.dispatch('newBookmark', 'clear')
        console.log('we are about to create content')
        console.log(this.content)
        var response = await AuthorService.createContentData(this.content)
        if (response.data.error != true) {
          this.$router.push({
            name: 'previewLibrary',
            params: {
              countryCODE: this.$route.params.countryCODE,
              languageISO: this.$route.params.languageISO,
              fileFILENAME: this.$route.params.fileFILENAME
            }
          })
        } else {
          this.error = true
          this.loaded = false
          this.error_message = response.data.message
        }
      } catch (error) {
        console.log('LIBRARY EDIT There was an error in Saving Form ', error)
        this.loaded = false
        this.error_message = error
        this.error = true
      }
    },
    async showForm() {
      try {
        await this.getLibrary()
        // console.log('after get Libary')
        var param = {}
        param.image_dir = this.bookmark.language.image_dir
        console.log('image dir: ' + param.image_dir.substring(0, 2))
        this.image_permission = this.authorize(
          'write',
          param.image_dir.substring(0, 1)
        )
        // get images
        var img = await AuthorService.getImages(param)

        if (img) {
          this.images = img.sort()
        }
        // get folders
        param.country_code = this.$route.params.countryCODE
        param.language_iso = this.$route.params.languageISO
        var folder = await AuthorService.getFoldersContent(param)
        if (folder) {
          this.folders = folder
        }
        // get styles
        var style = await AuthorService.getStyles(param)
        if (style) {
          this.styles = style
        }
        //get templates
        var template = await AuthorService.getTemplates(param)
        if (template) {
          this.templates = template
        }
        this.booklist = this.books
        var arrayLength = this.bookmark.library.length
        for (var i = 0; i < arrayLength; i++) {
          if (!this.booklist.includes(this.bookmark.library[i].book)) {
            this.booklist.push(this.bookmark.library[i].book)
          }
        }
        this.booklist.sort()
        if (!this.image) {
          this.image = this.$route.params.fileFILENAME + '.png'
        }
        this.authorized = this.authorize(
          'write',
          this.$route.params.countryCODE
        )
        this.loaded = true
        this.loading = false
        console.log('after loading is true')
      } catch (error) {
        console.log('There was an error in Library.vue:', error) // Logs out the error
        this.error_message = error + 'Library Edit - created()'
        this.error = true
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
    if (!this.$route.params.fileFILENAME) {
      this.$route.params.fileFILENAME = 'library'
    }
  },
  async created() {
    this.library = {}
    this.text = ''
    this.image = ''
    this.showForm()
  }
}
</script>

<style scoped>
.app-card {
  margin-bottom: 90px;
}

.float-right {
  text-align: right;
}
</style>
