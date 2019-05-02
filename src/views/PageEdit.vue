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
        <div class="app-link">
          <div class="app-card -shadow">
            <div v-on:click="goBack()">
              <img
                v-bind:src="appDir.library + this.bookmark.language.image_dir + '/' + this.bookmark.book.image"
                class="book"
              >

              <div class="book">
                <span class="bold">{{this.bookmark.book.title}}</span>
              </div>
            </div>
          </div>
        </div>

        <h1
          v-if="this.bookmark.page.count"
        >{{this.bookmark.page.count}}. {{this.bookmark.page.title}}</h1>
        <h1 v-else>{{this.bookmark.page.title}}</h1>
        <p>
          <vue-ckeditor v-model="pageText" :config="config"/>
        </p>
        <div class="version">
          <p class="version">Version 1.01</p>
        </div>
        <button class="button red" @click="saveForm">Save Changes</button>
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
import NavBar from '@/components/NavBarAdmin.vue'
import './ckeditor/index.js'
import VueCkeditor from 'vue-ckeditor2'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { pageMixin } from '@/mixins/PageMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, pageMixin, authorMixin],
  props: ['countryCODE', 'languageISO', 'bookNAME', 'fileFILENAME'],
  components: {
    NavBar,
    VueCkeditor
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      authorized: false,
      pageText: '',
      loading: false,
      loaded: true,
      error: null,
      htmlText: 'This is what I want to say',
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
        extraPlugins: ['bidi', 'uploadimage', 'uploadwidget', 'clipboard'],
        extraAllowedContent: 'ol(*)',
        contentsCss: '/content/' + this.$route.params.css,
        stylesSet: this.$route.params.stylesSET,
        templates_replaceContent: false,
        templates_files: [
          '/templates/' + this.$route.params.stylesSET + 'CKEDITOR.js'
        ],
        filebrowserUploadUrl: 'something.php',
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
          { name: 'colors', groups: ['colors'] },
          { name: 'about', groups: ['about'] }
        ],
        height: 600,
        removeButtons:
          'About,Button,Checkbox,CreatePlaceholder,DocProps,Flash,Form,HiddenField,Iframe,NewPage,PageBreak,Preview,Print,Radio,Save,Scayt,Select,Smiley,SpecialChar,TextField,Textarea'
      }
    }
  },
  methods: {
    goBack() {
      window.history.back()
    },
    async loadTemplate() {
      this.authorized = this.authorize('write', this.$route.params.countryCODE)
      this.loading = false
      this.loaded = true
      if (this.bookmark.book.template) {
        this.$route.params.template = this.bookmark.book.template
        console.log('looking for template')
        console.log(this.$route.params)
        var res = await AuthorService.getTemplate(this.$route.params)
        console.log(res)
        if (res) {
          console.log('I found template')
          this.pageText = res
        }
      }
    },
    async saveForm() {
      try {
        this.content.text = ContentService.validate(this.pageText)
        this.content.country_code = this.$route.params.countryCODE
        this.content.language_iso = this.$route.params.languageISO
        this.content.folder = this.bookmark.book.folder
        this.content.filename = this.$route.params.fileFILENAME
        this.content.filetype = 'html'
        this.$store.dispatch('newBookmark', 'clear')
        var valid = await AuthorService.createContentData(this.content)
        this.$router.push({
          name: 'previewPage',
          params: {
            countryCODE: this.$route.params.countryCODE,
            languageISO: this.$route.params.languageISO,
            bookNAME: this.$route.params.bookNAME,
            fileFILENAME: this.$route.params.fileFILENAME
          }
        })
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
    var ok = false
    var styleSets = ['compass', 'firststeps', 'fsteps', 'myfriends', 'multiply']
    this.$route.params.stylesSET = 'unknown'
    var arrayLength = styleSets.length
    for (var i = 0; i < arrayLength; i++) {
      if (this.$route.params.cssFORMATTED.includes(styleSets[i])) {
        this.$route.params.stylesSET = styleSets[i]
      }
    }
    this.$route.params.version = 'lastest'
    this.$route.params.pageNAME = this.$route.params.fileFILENAME
    var css = this.$route.params.cssFORMATTED
    var clean = css.replace(/-/g, '/')
    this.$route.params.css = clean
    console.log('final params')
    console.log(this.$route.params)
  },
  async created() {
    try {
      console.log('in Created')
      await this.getPage(this.$route.params)
      console.log('Got page')
      console.log('I am about to authorize to write')
      this.authorized = this.authorize('write', this.$route.params.countryCODE)
      console.log('css')
      console.log(this.bookmark.book.style)
    } catch (error) {
      console.log('There was an error in Page.vue:', error)
      this.loadTemplate()
    }
  }
}
</script>



<style scoped>
.float-right {
  text-align: right;
}
</style>
