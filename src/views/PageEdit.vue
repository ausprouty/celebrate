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
        <div class="app-link">
          <div class="app-card -shadow">
            <div v-on:click="goBack()">
              <img v-bind:src="this.bookmark.book.image.image" class="book" />

              <div class="book">
                <span class="title">{{ this.bookmark.book.title }}</span>
              </div>
            </div>
          </div>
        </div>
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
          <button class="button green" @click="loadTemplate">
            Insert Template
          </button>
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
            <button class="button green" @click="insertPassage">
              Insert Passage
            </button>
          </div>
          <p>
            <vue-ckeditor v-model="pageText" :config="config" />
          </p>
          <div class="version">
            <p class="version">Version 1.01</p>
          </div>
          <button class="button red" @click="saveForm">Save Changes</button>
        </div>
      </div>
      <div v-if="!this.authorized">
        <p>
          You need to
          <a href="/login">login to make changes</a> here
        </p>
      </div>
      <div></div>
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
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { pageMixin } from '@/mixins/PageMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, pageMixin, authorMixin],
  props: ['country_code', 'language_iso', 'folder_name', 'filename'],
  components: {
    NavBar,
    VueCkeditor
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      authorized: false,
      request_passage: false,
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
        //filebrowserImageUploadUrl:
        //  process.env.VUE_APP_URL +
        //  'ckfinder/core/connector/php/connector.php?command=QuickUpload&currentFolder=' +
        //  this.languageDirectory,
        //filebrowserUploadUrl:
        //  process.env.VUE_APP_URL +
        // 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=File&currentFolder=' +
        // this.languageDirectory,

        // filebrowserImageUploadUrl:
        //   process.env.VUE_APP_URL +
        //   'ckfinder/core/connector/php/connector.php?command=QuickUpload',
        filebrowserUploadUrl:
          process.env.VUE_APP_URL +
          'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',

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
        height: 600
        // removeButtons:
        //   'About,Button,Checkbox,CreatePlaceholder,DocProps,Flash,Form,HiddenField,Iframe,NewPage,PageBreak,Preview,Print,Radio,Save,Scayt,Select,Smiley,SpecialChar,TextField,Textarea'
      }
    }
  },
  methods: {
    goBack() {
      window.history.back()
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
      console.log('params for Get passage')
      console.log(params)
      var bible = await BibleService.getBiblePassage(params)
      console.log('results of getBiblePassage')
      console.log(bible)
      if (typeof bible !== 'undefined') {
        console.log('I am replacing text')

        var temp = this.pageText.replace('[BibleText]', bible.data.content.text)
        console.log('temp')
        console.log(temp)
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
      console.log('in Load Template')
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
        console.log('looking for template')
        console.log(this.$route.params)
        var res = await AuthorService.getTemplate(this.$route.params)
        console.log(res)
        if (res) {
          console.log('I found template')
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
    console.log('before Create')
    console.log(this.$route.params)
    // set directory for custom images
    //see https://ckeditor.com/docs/ckfinder/ckfinder3-php/integration.html
    this.languageDirectory =
      '/content/' +
      this.$route.params.country_code +
      '/' +
      this.$route.params.language_iso +
      '/images/custom'
    console.log('this.languageDirectory')
    console.log(this.languageDirectory)
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
    console.log('final params')
    console.log(this.$route.params)
  },
  async created() {
    try {
      console.log('in Created')
      await this.getPage(this.$route.params)
      if (this.pageText.includes('[')) {
        this.request_passage = true
      }
      console.log('I am about to authorize to write')
      this.authorized = this.authorize('write', this.$route.params.country_code)
      console.log('css')
      console.log(this.bookmark.book.style)
    } catch (error) {
      console.log('There was an error in Page.vue:', error)
      await this.loadTemplate()
    }
  }
}
</script>

<style scoped>
.float-right {
  text-align: right;
}
</style>
