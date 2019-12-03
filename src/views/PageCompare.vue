<template>
  <div>
    <NavBar />

    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{ this.error_message }}</div>
    <div class="compare" v-if="loaded">
      <div v-if="!this.authorized">
        <p>Almost ready</p>
      </div>
      <div v-if="this.authorized">
        <div class="left_column">
          <link rel="stylesheet" v-bind:href="this.bookmark.book.style" />
          <div class="select-top">
            <div class="app-link-small">
              <div class="app-card -shadow">
                <div v-on:click="goBack()">
                  <img v-bind:src="this.bookmark.book.image.image" class="book" />

                  <div class="book">
                    <span class="title">{{ this.bookmark.book.title }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="compare-select">
              <h1>Comparing</h1>
              <v-select
                label="country_name"
                :options="comparison_countries"
                :disabled="this.block_selection"
                v-model="comparison_country"
                v-on:change="getNewComparisons('country')"
              ></v-select>
              <v-select
                label="language_name"
                :options="comparison_languages"
                :disabled="this.block_selection"
                v-model="comparison_language"
                v-on:change="getNewComparisons('language')"
              ></v-select>
              <v-select
                label="library_name"
                :options="comparison_libraries"
                :disabled="this.block_selection"
                v-model="comparison_library"
                v-on:change="getNewComparisons('library')"
              ></v-select>
              <v-select
                label="book_title"
                :options="comparison_books"
                :disabled="this.block_selection"
                v-model="comparison_book"
                v-on:change="getNewComparisons('book')"
              ></v-select>
              <v-select
                label="chapter_title"
                :options="comparison_chapters"
                :disabled="this.block_selection"
                v-model="comparison_chapter"
                v-on:change="getNewComparisons('chapter')"
              ></v-select>
              <v-select
                label="version_title"
                :options="comparison_versions"
                :disabled="this.block_selection"
                v-model="comparison_version"
                v-on:change="getNewComparisons('version')"
              ></v-select>
            </div>
          </div>
          <div class = "editable-text">
          <h1 v-if="this.bookmark.page.count">
            {{ this.bookmark.page.count }}. {{ this.bookmark.page.title }}
            <a
              target="_blank"
              class="help"
              href="https://prototype.myfriends.network/content/HD/eng/help-1/page_edit.html"
            >
              <img class="help-icon" src="/images/icons/help.png" />
            </a>
          </h1>

          <h1 v-else>
            {{ this.bookmark.page.title }}
            <a
              target="_blank"
              class="help"
              href="https://prototype.myfriends.network/content/HD/eng/help-1/page_edit.html"
            >
              <img class="help-icon" src="/images/icons/help.png" />
            </a>
          </h1>

          <div v-if="this.need_template">
            <div class="form">
              <BaseSelect
                v-model="page_template"
                label="Templates:"
                :options="templates"
                class="field"
              />
            </div>
            <button class="button green" @click="loadTemplate">Insert Template</button>
          </div>
          <div>
            <div v-if="this.request_passage">
              <div class="form">
                <BaseInput
                  v-model="reference"
                  label="Passage to Insert into  [PassageLocation]"
                  type="text"
                  placeholder
                  class="field"
                />
              </div>
              <button class="button green" @click="insertPassage">Insert Passage</button>
            </div>
            <div class="text-edit">
              <vue-ckeditor v-model="pageText" :config="config" />
            </div>
          </div>
          </div>
          <div class="text-compare">
            <div v-html="this.compareText"></div>
          </div>
          <div class="footer">
            <div class="version">
              <p class="version">Version 1.01</p>
            </div>
            <button class="button red" @click="saveForm">Save Changes</button>
          </div>
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
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
import BibleService from '@/services/BibleService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import './ckeditor/index.js'
import VueCkeditor from 'vue-ckeditor2'
import vSelect from 'vue-select'
import '@/assets/css/vueSelect.css'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { pageMixin } from '@/mixins/PageMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, pageMixin, authorMixin],
  props: ['country_code', 'language_iso', 'folder_name', 'filename'],
  components: {
    NavBar,
    VueCkeditor,
    'v-select': vSelect
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      authorized: false,
      request_passage: false,
      mounted: false,
      reference: null,
      templates: [],
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
      block_count: 0,
      block_selection: false,
      comparison_in_progress: false,
      comparison_previous: [],
      compareText: 'this is my text to show you',
      comparison_countries: [],
      comparison_country: null,
      comparison_languages: [],
      comparison_language: null,
      comparison_libraries: [],
      comparison_library: null,
      comparison_books: [],
      comparison_book: null,
      comparison_chapters: [],
      comparison_chapter: null,
      comparison_versions: [],
      comparison_version: null,
      languages: [],
      series: [],
      config: {
        extraPlugins: [
          'bidi',
          'uploadimage',
          'iframe',
          'uploadwidget',
          'clipboard',
          'videoembed',
          'templates'
        ],
        extraAllowedContent: [
          '*(*)[id]',
          'ol[*]',
          'span[*]',
          'align[*]',
          'webkitallowfullscreen',
          'mozallowfullscreen',
          'allowfullscreen'
        ],
        contentsCss: this.$route.params.css,
        stylesSet: this.$route.params.styles_set,
        templates_replaceContent: false,
        templates_files: [
          '/templates/' + this.$route.params.styles_set + 'CKEDITOR.js'
        ],
        // Configure your file manager integration. This example uses CKFinder 3 for PHP.
        // https://ckeditor.com/docs/ckfinder/ckfinder3-php/howto.html#howto_private_folders
        filebrowserBrowseUrl:
          process.env.VUE_APP_URL + 'ckfinder/ckfinder.html',
        filebrowserUploadUrl:
          process.env.VUE_APP_URL +
          'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&currentFolder=' +
          this.languageDirectory,

        // end Configuration
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
          { name: 'colors', groups: ['colors'] }
        ],
        height: 1200
        // removeButtons:
        //   'About,Button,Checkbox,CreatePlaceholder,DocProps,Flash,Form,HiddenField,Iframe,NewPage,PageBreak,Preview,Print,Radio,Save,Scayt,Select,Smiley,SpecialChar,TextField,Textarea'
      }
    }
  },
  methods: {
    goBack() {
      window.history.back()
    },
    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async getComparisons(params) {
      this.block_selection = true
      var response = await AuthorService.getComparisons(params)

      console.log('getComparisons response')
      console.log(response)
      this.getPageToCompare(response['params'])
      this.comparison_previous = response['params']
      this.comparison_countries = response['countries']['countries']
      this.comparison_country = response['countries']['country']
      this.comparison_languages = response['languages']['languages']
      this.comparison_language = response['languages']['language']
      this.comparison_libraries = response['library']['libraries']
      this.comparison_library = response['library']['library']
      this.comparison_books = response['books']['books']
      this.comparison_book = response['books']['book']
      this.comparison_chapters = response['chapters']['chapters']
      this.comparison_chapter = response['chapters']['chapter']
      this.comparison_versions = response['versions']['versions']
      this.comparison_version = response['versions']['version']
      await this.sleep(1000)
      this.block_selection = false
    },
    getNewComparisons(scope) {
      // this keeps the onchange from occuring until after all values are loaded from the last change
      if (
        this.block_selection == true ||
        this.mounted == false ||
        this.block_count < 6
      ) {
        if (this.loading == true) {
          console.log('I blocked getNewComparison because we not yet mounted')
        }
        if (this.block_selection == true) {
          console.log(
            'I blocked getNewComparison because block_selection is true'
          )
        }
        if (this.block_count < 6) {
          console.log(
            'I blocked getNewComparison because count was ' + this.block_count
          )
          this.block_count = this.block_count + 1
        }
        return
      }
      var params = this.comparison_previous
      console.log('I allowed getNewComparison for ' + scope)
      this.block_selection = true
      var empty = ''

      switch (scope) {
        case 'country':
          console.log(this.comparison_country)
          params.country_code = this.comparison_country.country_code
            ? this.comparison_country.country_code
            : this.$route.params.country_code
          params.recnum = null
          this.block_count = 1
          break
        case 'language':
          console.log(this.comparison_language)
          params.language_iso = this.comparison_language.language_iso
            ? this.comparison_language.language_iso
            : this.$route.params.language_iso
          params.recnum = null
          this.block_count = 2
          break
        case 'library':
          console.log(this.comparison_library.library_code)
          params.library_code = this.comparison_library.library_code
            ? this.comparison_library.library_code
            : this.$route.params.library_code
          params.recnum = null
          this.block_count = 3
          break
        case 'book':
          console.log(this.comparison_book)
          params.folder_name = this.comparison_book.book_code
            ? this.comparison_book.book_code
            : this.$route.params.folder_name
          params.filename = null
          params.recnum = null
          this.block_count = 4
          break
        case 'chapter':
          console.log(this.comparison_chapter)
          params.filename = this.comparison_chapter.chapter_filename
            ? this.comparison_chapter.chapter_filename
            : this.$route.params.filename
          params.recnum = null
          this.block_count = 5
          break
        case 'version':
          console.log(this.comparison_version.version_recnum)
          params.recnum = this.comparison_version.version_recnum
            ? this.comparison_version.version_recnum
            : empty
          this.block_count = 6
          break
      }
      console.log('getNewComparisons')
      console.log(params)
      this.getComparisons(params)
    },
    async getPageToCompare(params) {
      console.log('in getPageToCompare')
      console.log(params)
      if (params.folder_name != null) {
        var response = await ContentService.getPageDatabase(params)
        console.log(response)
        this.compareText = response.data.content.text
      } else {
        this.compareText = 'Continue Selection Process'
      }
    },
    async insertPassage() {
      var params = {}
      params.language_iso = this.$route.params.language_iso
      params.entry = this.reference
      params.dbt = await BibleService.getDbtArray(params)
      if (params.dbt.collection_code == 'OT') {
        params.bid = this.bookmark.language.bible_ot
      } else {
        params.bid = this.bookmark.language.bible_nt
      }
      //console.log('params for Get passage')
      // console.log(params)
      var bible = await BibleService.getBiblePassage(params)
      // console.log('results of getBiblePassage')
      // console.log(bible)
      if (typeof bible !== 'undefined') {
        //console.log('I am replacing text')

        var temp = this.pageText.replace('[BibleText]', bible.data.content.text)
        // console.log('temp')
        // console.log(temp)
        var temp2 = temp.replace(
          '"readmore" href=""',
          '"readmore" href="' + bible.data.content.link + '"'
        )
        temp = temp2.replace('[BibleReference]', bible.data.content.reference)
        temp2 = temp.replace('[REPLACE LINK]', '')
        var bible_block =
          bible.data.content.text +
          '<p><a class="readmore" href="' +
          bible.data.content.link +
          '">' +
          this.bookmark.language.read_more +
          '</a></p>'
        this.pageText = temp2.replace('[PassageLocation]', bible_block)
        //console.log('This is result of replace')
        //console.log(this.pageText)
        this.request_passage = false
      }
    },
    async loadTemplate() {
      //console.log('in Load Template')
      this.authorized = this.authorize('write', this.$route.params.country_code)
      this.loading = false
      this.loaded = true
      if (this.bookmark.book.template || this.page_template) {
        if (this.bookmark.book.template) {
          this.$route.params.template = this.bookmark.book.template
        }
        if (this.page_template) {
          this.$route.params.template = this.page_template
        }
        // console.log('looking for template')
        // console.log(this.$route.params)
        var res = await AuthorService.getTemplate(this.$route.params)
        // console.log(res)
        if (res) {
          // console.log('I found template')
          this.request_passage = true
          this.pageText = res
        }
      }
    },
    async saveForm() {
      try {
        this.content.text = ContentService.validate(this.pageText)
        this.content.route = JSON.stringify(this.$route.params)
        this.content.filetype = 'html'
        var response = await AuthorService.createContentData(this.content)
        this.$store.dispatch('newBookmark', 'clear')
        if (response.data.error != true) {
          this.$router.push({
            name: 'previewPage',
            params: {
              country_code: this.$route.params.country_code,
              language_iso: this.$route.params.language_iso,
              library_code: this.$route.params.library_code,
              folder_name: this.$route.params.folder_name,
              filename: this.$route.params.filename
            }
          })
        } else {
          this.error = true
          this.loaded = false
          this.error_message = response.data.message
        }
      } catch (error) {
        console.log('LIBRARY EDIT There was an error ', error)
        this.error = true
        this.loaded = false
        this.error_message = error
      }
    }
  },
  async beforeCreate() {
    //console.log('before Create')
    //console.log(this.$route.params)
    // set directory for custom images
    //see https://ckeditor.com/docs/ckfinder/ckfinder3-php/integration.html
    this.languageDirectory =
      this.$route.params.country_code +
      '/' +
      this.$route.params.language_iso +
      '/images/custom'
    // console.log('this.languageDirectory')
    // console.log(this.languageDirectory)
    // set style for ckeditor
    var styleSets = ['compass', 'firststeps', 'myfriends', 'multiply']
    this.$route.params.styles_set = 'unknown'
    var arrayLength = styleSets.length
    for (var i = 0; i < arrayLength; i++) {
      if (this.$route.params.cssFORMATTED.includes(styleSets[i])) {
        this.$route.params.styles_set = styleSets[i]
      }
    }
    this.$route.params.version = 'lastest'
    var css = this.$route.params.cssFORMATTED
    var clean = css.replace(/@/g, '/')
    this.$route.params.css = clean
    // console.log('final params')
    // console.log(this.$route.params)
  },
  async created() {
    try {
      this.block_selection = true
      this.mounted = false
      this.comparison_previous = {}
      console.log('mounted is now false')
      this.authorized = this.authorize('write', this.$route.params.country_code)
      await this.getPage(this.$route.params)
      if (this.pageText.includes('[')) {
        this.request_passage = true
      }
      await this.getComparisons(this.$route.params)
    } catch (error) {
      console.log('There was an error in Page.vue:', error)
      await this.loadTemplate()
    }
  },
  mounted() {
    this.mounted = true
    this.block_selection = false
    console.log('mounted is now true')
  }
}
</script>

<style scoped>
.float-right {
  text-align: right;
}

#app {
  width: 80%;
}
div.text-edit,
div.app-link-small {
  float: left;
  width: 50%;
}
.app-card{
  height:300px;
}
div.text-compare,
div.compare-select {
  float: right;
  width: 40%;
}
div.text-compare{
  padding-top:100px;
}
div.editable-text{
  display:block;
  clear:right;
}
div.footer {
  width: 100%;
  float: left;
}
</style>
