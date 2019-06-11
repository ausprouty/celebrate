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
      </div>
      <div v-if="this.authorized">
        <h1>{{ this.$route.params.folderNAME }}</h1>
        <p>
          <vue-ckeditor v-model="this.description" :config="config" />
        </p>
        <div>
          <button class="button" @click="publishAll">
            Select ALL to publish?
          </button>
          <div
            v-for="(chapter, index) in $v.chapters.$each.$iter"
            :key="chapter.id"
            :chapter="chapter"
          >
            <div
              class="app-card -shadow"
              v-bind:class="{ notpublished: !chapter.publish.$model }"
            >
              <div
                class="float-right"
                style="cursor:pointer"
                @click="deleteChapterForm(index)"
              >
                X
              </div>
              <div class="form">
                <BaseInput
                  v-model="chapter.count.$model"
                  label="Chapter Number"
                  type="text"
                  placeholder="leave blank for un-numbered items"
                  class="field"
                  :class="{ error: chapter.count.$error }"
                  @blur="chapter.count.$touch()"
                />
                <BaseInput
                  v-model="chapter.title.$model"
                  label="Title"
                  type="text"
                  placeholder
                  class="field"
                  :class="{ error: chapter.title.$error }"
                  @blur="chapter.title.$touch()"
                />
                <template v-if="chapter.title.$error">
                  <p v-if="!chapter.title.required" class="errorMessage">
                    Title is required
                  </p>
                </template>

                <BaseInput
                  v-model="chapter.description.$model"
                  label="Description:"
                  type="text"
                  placeholder
                  class="field"
                  :class="{ error: chapter.description.$error }"
                  @blur="chapter.description.$touch()"
                />
                <template v-if="chapter.description.$error">
                  <p v-if="!chapter.description.required" class="errorMessage">
                    Description is required
                  </p>
                </template>

                <BaseInput
                  v-model="chapter.filename.$model"
                  label="File Name"
                  type="text"
                  placeholder
                  class="field"
                  :class="{ error: chapter.filename.$error }"
                  @blur="chapter.filename.$touch()"
                />
                <template v-if="chapter.filename.$error">
                  <p v-if="!chapter.filename.required" class="errorMessage">
                    Description is required
                  </p>
                </template>
                <input
                  type="checkbox"
                  id="checkbox"
                  v-model="chapter.publish.$model"
                />
                <label for="checkbox">
                  <h2>Publish?</h2>
                </label>
              </div>
            </div>
          </div>

          <div v-if="this.authorized">
            <div v-if="this.new">
              <p class="errorMessage">
                Import Series in tab format (number| title | description| bible
                reference| filename)
              </p>
              <label>
                <input type="file" ref="file" v-on:change="importSeries()" />
              </label>
              <br />
              <br />
            </div>
            <button class="button" @click="addNewChapterForm">
              New Chapter
            </button>

            <div v-if="!$v.$anyError">
              <button class="button red" @click="saveForm">Save Changes</button>
            </div>
            <div v-if="$v.$anyError">
              <button class="button grey">Disabled</button>
              <p v-if="$v.$anyError" class="errorMessage">
                Please fill out the required field(s).
              </p>
            </div>
            <br />
            <br />
            <br />
          </div>
          <div v-if="!this.authorized">
            <p>
              You need to
              <a href="/login">login to make changes</a> here
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
import NavBar from '@/components/NavBarLibraryFriends.vue'
import './ckeditor/index.js'
import VueCkeditor from 'vue-ckeditor2'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { freeformMixin } from '@/mixins/FreeformMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
import { required } from 'vuelidate/lib/validators'
export default {
  mixins: [bookMarkMixin, freeformMixin, authorMixin],
  props: ['countryCODE', 'languageISO', 'folderNAME'],
  components: {
    NavBar,
    VueCkeditor
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      seriesDetails: {
        series: '',
        language: '',
        description: ''
      },
      chapters: [
        {
          id: null,
          title: null,
          desciption: null,
          count: null,
          filename: null
        }
      ],
      description: 'hi there',
      dir: 'ltr',
      file: null,
      loading: false,
      loaded: false,
      error: false,
      authorized: false,
      new: false,
      content: {
        recnum: '',
        version: '',
        edit_date: '',
        edit_uid: '',
        publish_uid: '',
        publish_date: '',
        language_iso: '',
        country_code: '',
        folder: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      },
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
        contentsCss: '/content/' + this.$route.params.css,
        stylesSet: this.$route.params.stylesSET,
        templates_replaceContent: false,
        templates_files: [
          '/templates/' + this.$route.params.stylesSET + 'CKEDITOR.js'
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
        height: 600,
        removeButtons:
          'About,Button,Checkbox,CreatePlaceholder,DocProps,Flash,Form,HiddenField,Iframe,NewPage,PageBreak,Preview,Print,Radio,Save,Scayt,Select,Smiley,SpecialChar,TextField,Textarea'
      }
    }
  },
  validations: {
    chapters: {
      required,
      $each: {
        title: { required },
        description: {},
        count: '',
        filename: { required },
        publish: ''
      }
    }
  },
  methods: {
    addNewChapterForm() {
      if (!this.chapters) {
        this.chapters = []
      }
      this.chapters.push({
        id: null,
        title: null,
        description: null,
        count: null,
        filename: null,
        publish: null
      })
    },
    publishAll() {
      var arrayLength = this.chapters.length
      console.log(' Item count:' + arrayLength)
      for (var i = 0; i < arrayLength; i++) {
        this.$v.chapters.$each.$iter[i].publish.$model = true
      }
    },
    deleteChapterForm(id) {
      this.chapters.splice(id, 1)
    },
    async importSeries() {
      console.log('about to import series')
      this.file = this.$refs.file.files[0]
      console.log('this.file')
      console.log(this.file)
      var param = []
      param.country_code = this.$route.params.countryCODE
      param.language_iso = this.$route.params.languageISO
      param.index = 'index'
      param.folder = this.$route.params.folderNAME
      param.template = this.bookmark.book.template
      param.description = this.description
      await AuthorService.setupSeriesPage(param, this.file)
      console.log('back from update')
      try {
        this.getSeries(this.$route.params)
        console.log('tried get series')
        this.authorized = this.authorize(
          'write',
          this.$route.params.countryCODE
        )
      } catch (error) {
        console.log('There was an error in SeriesEdit.vue:', error) // Logs out the error
      }
    },
    goBack() {
      window.history.back()
    },

    async saveForm() {
      try {
        this.content.text = ContentService.validate(this.pageText)
        this.content.country_code = this.$route.params.countryCODE
        this.content.folder = this.$route.params.folderNAME
        this.content.language_iso = null
        this.content.folder = null
        this.content.filename = 'index'
        this.content.filetype = 'html'
        this.$store.dispatch('newBookmark', 'clear')
        var response = await AuthorService.createContentData(this.content)
        if (response.data.error != true) {
          this.$router.push({
            name: 'previewSeriesPage',
            params: {
              countryCODE: this.$route.params.countryCODE,
              folderNAME: this.$route.params.folderNAME
            }
          })
        } else {
          this.error = true
          this.loaded = false
          this.error_message = response.data.message
        }
      } catch (error) {
        console.log('SERIES PAGE EDIT There was an error ', error)
        this.error = true
        this.loaded = false
        this.error_message = error
      }
    }
  },
  async beforeCreate() {
    this.$route.params.stylesSET = 'myfriends'
    this.$route.params.version = 'lastest'
    this.$route.params.fileFILENAME = 'index'
    this.$route.params.css = 'AU/styles/AU-freeform.css'
    console.log('final params')
    console.log(this.$route.params)
  },
  async created() {
    try {
      this.pageText = 'hello'
      console.log('in Created')
      this.$route.params.fileFILENAME = 'index'
      console.log(this.$route)
      this.recnum = null
      this.publish_date = null
      this.description = 'from SeriesPageEdit'
      this.chapters = []
      this.new = true
      await this.getSeriesPage(this.$route.params)
      console.log('I am about to authorize to write')
      console.log('chapters')
      console.log(this.chapters)

      this.authorized = this.authorize('write', this.$route.params.countryCODE)
    } catch (error) {
      console.log('There was an error in Country.vue:', error)
    }
  }
}
</script>
