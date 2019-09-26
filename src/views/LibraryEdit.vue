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
        <h1>
          Library
          <a
            target="_blank"
            class="help"
            href="https://prototype.myfriends.network/content/HD/eng/help-1/library_edit"
          >
            <img class="help-icon" src="/images/icons/help.png" />
          </a>
        </h1>
        <div v-if="images">
          <img v-bind:src="this.format.image.image" class="header" />
          <br />
        </div>
        <br />
        <br />

        <LibraryFormatTemplate v-bind:format="format" />

        <hr />
        <h2>Preliminary Text</h2>

        <p>
          <vue-ckeditor v-model="text" :config="config" />
        </p>
      </div>
      <br />
      <hr />

      <br />
      <h2>Books</h2>
      <div>
        <button class="button" @click="publishAll">
          Select ALL to publish?
        </button>
      </div>
      <div v-for="(book, id) in $v.books.$each.$iter" :key="id" :book="book">
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
          <h2>Name and Code</h2>
          <div>
            <BaseInput
              v-model="book.id.$model"
              label="Book Number:"
              type="text"
              placeholder="#"
              class="field"
              :class="{ error: book.id.$error }"
              @blur="book.id.$touch()"
            />
          </div>
          <div>
            <BaseInput
              v-model="book.title.$model"
              label="Title:"
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
          </div>
          <div>
            <BaseSelect
              label="Code:"
              :options="booklist"
              v-model="book.code.$model"
              class="field"
              :class="{ error: book.code.$error }"
              @mousedown="book.code.$touch()"
            />
          </div>
          <div>
            <p>
              <a class="black" @click="createBook(book.code.$model)"
                >Create new Code</a
              >
            </p>
          </div>
          <div
            v-bind:id="book.title.$model"
            v-bind:class="{ hidden: isHidden }"
          >
            <BaseInput
              label="New Code:"
              v-model="book.code.$model"
              type="text"
              placeholder="code"
              class="field"
            />
            <button class="button" @click="addNewBookTitle(book.title.$model)">
              Save Code
            </button>
          </div>
          <div v-if="images">
            <div>
              <h3>Book Image:</h3>
              <div v-if="book.image.$model">
                <img v-bind:src="book.image.$model.image" class="book" />
                <br />
              </div>
              <v-select
                :options="images"
                label="title"
                v-model="book.image.$model"
              >
                <template slot="option" slot-scope="option">
                  <img :src="option.image" />
                  {{ option.title }}
                </template>
              </v-select>
            </div>
            <div v-if="image_permission">
              <label>
                Add new Image&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="file"
                  v-bind:id="book.code.$model"
                  ref="image"
                  v-on:change="handleImageUpload(book.code.$model)"
                />
              </label>
            </div>
          </div>
          <div>
            <h3>Format and Styling:</h3>
            <BaseSelect
              label="Format:"
              :options="formats"
              v-model="book.format.$model"
              class="field"
              :class="{ error: book.format.$error }"
              @mousedown="book.format.$touch()"
            />
            <template v-if="book.format.$error">
              <p v-if="!book.format.required" class="errorMessage">
                Format is required
              </p>
            </template>
          </div>
          <div>
            <BaseSelect
              label="Book and Chapters Style Sheet:"
              :options="styles"
              v-model="book.style.$model"
              class="field"
            />
            <template v-if="style_error">
              <p class="errorMessage">Only .css files may be uploaded</p>
            </template>

            <label>
              Add new stylesheet&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="file"
                v-bind:id="book.title.$model"
                ref="style"
                v-on:change="handleStyleUpload(book.code.$model)"
              />
            </label>

            <BaseSelect
              label="Template:"
              :options="templates"
              v-model="book.template.$model"
              class="field"
              :class="{ error: book.template.$error }"
              @mousedown="book.template.$touch()"
            />
            <label>
              Add new template&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="file"
                v-bind:id="book.title.$model"
                ref="template"
                v-on:change="handleTemplateUpload(book.code.$model)"
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
import LibraryFormatTemplate from '@/components/LibraryFormatTemplate.vue'
import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
import vSelect from 'vue-select'
// see https://stackoverflow.com/questions/55479380/adding-images-to-vue-select-dropdown
import '@/assets/css/vueSelect.css'

import './ckeditor/index.js'
import VueCkeditor from 'vue-ckeditor2'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { libraryMixin } from '@/mixins/LibraryMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
import { required } from 'vuelidate/lib/validators'
export default {
  mixins: [bookMarkMixin, libraryMixin, authorMixin],
  components: {
    NavBar,
    LibraryFormatTemplate,
    VueCkeditor,
    'v-select': vSelect
  },
  props: ['country_code', 'language_iso', 'library_code'],
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  data() {
    return {
      formats: ['page', 'series'],
      book_images: [],
      images: [],
      folders: [],
      styles: [],
      booklist: [
        'about',
        'basics',
        'community',
        'compass',
        'life',
        'multiply',
        'steps'
      ],
      templates: [],
      authorized: false,
      image_permission: false,
      isHidden: true,
      text: 'What will you write?',
      image: 'withFriends.png',
      style_error: false,
      template_error: false,
      config: {
        extraPlugins: [
          'bidi',
          'uploadimage',
          'uploadwidget',
          'clipboard',
          'videoembed',
          'iframe'
        ],
        extraAllowedContent: ['*(*)[id]', 'ol[*]', 'iframe(*)'],
        contentsCss: this.$route.params.css,
        stylesSet: this.$route.params.styles_set,
        templates_replaceContent: false,
        templates_files: [
          '/templates/' + this.$route.params.styles_set + 'CKEDITOR.js'
        ],
        // Upload images to a CKFinder connector (note that the response type is set to JSON).
        uploadUrl:
          '/apps/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
        // Configure your file manager integration. This example uses CKFinder 3 for PHP.
        filebrowserBrowseUrl: '/apps/ckfinder/ckfinder.html',
        filebrowserImageBrowseUrl: '/apps/ckfinder/ckfinder.html?type=Images',
        filebrowserUploadUrl:
          '/apps/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
        filebrowserImageUploadUrl:
          '/apps/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
        toolbarGroups: [
          { name: 'styles', groups: ['styles'] },
          { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
          {
            name: 'editing',
            groups: ['find', 'selection', 'spellchecker', 'editing']
          },
          { name: 'links', groups: ['links'] },
          { name: 'insert', groups: ['insert'] },
          { name: 'forms', groups: ['forms'] },
          { name: 'tools', groups: ['tools'] },
          { name: 'document', groups: ['mode', 'document', 'doctools'] },
          { name: 'clipboard', groups: ['clipboard', 'undo'] },
          { name: 'others', groups: ['others'] },
          '/',
          {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
          },
          { name: 'iframe', groups: ['iframe'] },
          { name: 'colors', groups: ['colors'] },
          { name: 'about', groups: ['about'] }
        ],
        height: 200,
        removeButtons:
          'About,Button,Checkbox,CreatePlaceholder,DocProps,Flash,Form,HiddenField,NewPage,PageBreak,Preview,Print,Radio,Save,Scayt,Select,Smiley,SpecialChar,TextField,Textarea'
      }
    }
  },
  validations: {
    books: {
      required,
      $each: {
        id: { required },
        code: {},
        title: { required },
        style: {},
        image: { required },
        format: { required },
        template: '',
        publish: ''
      }
    }
  },
  methods: {
    addNewBookForm() {
      if (this.books.length == 0) {
        this.newLibrary()
      } else {
        this.books.push({
          id: '',
          code: '',
          title: '',
          style: '',
          image: '',
          format: '',
          template: '',
          publish: ''
        })
      }
    },
    addNewBookTitle(title) {
      console.log('I came to addNewBookTitle')
      console.log(title)
      this.booklist = []
      var change = this.$v.books.$model
      console.log('change')
      console.log(change)
      var arrayLength = change.length
      for (var i = 0; i < arrayLength; i++) {
        this.booklist.push(this.$v.books.$model[i].code)
      }
      console.log(this.booklist)
      console.log('about to hide')
      this.isHidden = true
      console.log('hidden')
    },
    createBook(title) {
      console.log(title)
      this.isHidden = false
    },
    publishAll() {
      var arrayLength = this.books.length
      console.log(' Item count:' + arrayLength)
      for (var i = 0; i < arrayLength; i++) {
        this.$v.books.$each.$iter[i].publish.$model = true
      }
    },
    async createFolder(folder) {
      console.log(folder)
      var params = {}
      params.route = this.$route.params
      params.route.folder_name = folder.toLowerCase()
      params.route = JSON.stringify(params.route)
      AuthorService.createContentFolder(params)
      this.folders = await AuthorService.getFoldersContent(params)
    },
    createTemplate() {
      this.$router.push({
        name: 'createTemplate',
        params: {
          country_code: this.$route.params.country_code,
          language_iso: this.$route.params.language_iso
        }
      })
    },
    deleteBookForm(index) {
      this.books.splice(index, 1)
    },
    async handleImageUpload(code) {
      console.log('handleImageUpload: ' + code)
      var checkfile = {}
      var i = 0
      var arrayLength = this.$refs.image.length
      for (i = 0; i < arrayLength; i++) {
        checkfile = this.$refs.image[i]['files']
        if (checkfile.length == 1) {
          console.log('checkfile')
          console.log(checkfile)
          console.log(checkfile[0])
          console.log(checkfile[0].name)
          var filename = checkfile[0].name
          var type = AuthorService.typeImage(checkfile[0])
          if (type) {
            var params = {}
            params.directory = 'content/' + this.bookmark.language.image_dir
            params.name = code
            await AuthorService.imageStore(params, checkfile[0])
            // now update data on form
            console.log('code is  ' + code)
            for (i = 0; i < arrayLength; i++) {
              checkfile = this.$v.books.$each[i]
              //              console.log('checkfile.$model.code: ' + checkfile.$model.code)
              if (checkfile.$model.code == code) {
                this.$v.books.$each[i].$model.image.title = filename
                this.$v.books.$each[i].$model.image.image =
                  '/' + params.directory + '/' + filename

                console.log('trying to assign ' + filename)
              }
            }
            await this.saveForm('stay')
            this.showForm()
          }
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
            params.country_code = this.$route.params.country_code
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
          var type = AuthorService.typeTemplate(checkfile[0])
          if (type) {
            console.log('type ok')
            console.log(checkfile)
            var params = {}
            params.file = checkfile[0]
            params.country_code = this.$route.params.country_code
            params.language_iso = this.$route.params.language_iso
            params.folder_name = code
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
    async saveForm(action = null) {
      try {
        // create index files
        var check = ''
        var params = {}
        var route = this.$route.params
        var arrayLength = this.books.length
        for (var i = 0; i < arrayLength; i++) {
          check = this.books[i]
          if (check.format == 'series') {
            route.folder_name = check.code
            route.filename = 'index'
            console.log('parms for create Series Index')
            console.log(route)
            params.route = JSON.stringify(route)
            AuthorService.createSeriesIndex(params)
          }
        }
        // update library file
        var output = {}
        output.books = this.books
        output.format = this.format
        output.text = this.text
        var valid = ContentService.validate(output)
        this.content.text = JSON.stringify(valid)
        this.$route.params.filename = this.$route.params.library_code
        delete this.$route.params.folder_name
        this.content.route = JSON.stringify(this.$route.params)
        this.content.filetype = 'json'
        this.$store.dispatch('newBookmark', 'clear')
        console.log('we are about to create content')
        console.log(this.content)
        var response = await AuthorService.createContentData(this.content)
        if (response.data.error != true && action != 'stay') {
          this.$router.push({
            name: 'previewLibrary',
            params: {
              country_code: this.$route.params.country_code,
              language_iso: this.$route.params.language_iso,
              library_code: this.$route.params.library_code
            }
          })
        }
        if (response.data.error == true) {
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
        param.route = JSON.stringify(this.$route.params)
        param.image_dir = this.bookmark.language.image_dir
        console.log('image dir: ' + param.image_dir.substring(0, 2))
        this.image_permission = this.authorize(
          'write',
          param.image_dir.substring(0, 1)
        )
        // get images

        this.images = await this.getImages(this.bookmark.language.image_dir)
        console.log(this.images)

        // get folders

        var folder = await AuthorService.getFoldersContent(param)
        if (typeof folder !== 'undefined') {
          this.folders = folder
        }
        // get styles
        var style = await AuthorService.getStyles(param)
        if (typeof style !== 'undefined') {
          this.styles = style
        }
        //get templates
        var template = await AuthorService.getTemplates(param)
        if (typeof template !== 'undefined') {
          this.templates = template
        }
        // update booklist
        console.log('updating booklist')
        console.log(this.bookmark.library)
        var arrayLength = this.bookmark.library.books.length
        console.log('arrayLength ' + arrayLength)
        if (typeof arrayLength !== 'undefined') {
          for (var i = 0; i < arrayLength; i++) {
            // dealing with legacy data
            if (typeof this.bookmark.library.books[i].code === 'undefined') {
              if (typeof this.bookmark.library.books[i].name !== 'undefined') {
                this.bookmark.library.books[
                  i
                ].code = this.bookmark.library.books[i].name
              }
            }
            //console.log(this.bookmark.library.books[i].code)
            if (!this.booklist.includes(this.bookmark.library.books[i].code)) {
              this.booklist.push(this.bookmark.library.books[i].code)
            }
          }
        }
        if (typeof this.booklist !== 'undefined' && this.booklist.length > 0) {
          this.booklist.sort()
        }

        if (!this.image) {
          this.image = this.$route.params.library_code + '.png'
        }
        this.authorized = this.authorize(
          'write',
          this.$route.params.country_code
        )
        this.loaded = true
        this.loading = false
        console.log('after loading is true')
      } catch (error) {
        console.log('There was an error in Library.vue:', error) // Logs out the error
        this.error_message = error + 'Library Edit - showForm()'
        this.error = true
      }
    }
  },
  beforeCreate() {
    console.log('before Create')
    console.log(this.$route.params)
    this.$route.params.version = 'latest'
    if (!this.$route.params.library_code) {
      this.$route.params.library_code = 'library'
    }
    this.$route.params.styles_set = 'myfriends'
    this.$route.params.version = 'lastest'
    this.$route.params.filename = 'index'
    this.$route.params.css = 'AU/styles/AU-freeform.css'
  },
  async created() {
    this.library = []
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
