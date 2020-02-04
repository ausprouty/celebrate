<template>
  <div>
    <NavBar />

    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{ this.error_message }}</div>
    <div class="content" v-if="loaded">
      <div v-if="!this.authorized">
        <p>
          You have stumbled into a restricted page. Sorry I can not show it to
          you now
        </p>
      </div>
      <div v-if="this.authorized">
        <h1>Create Template</h1>
        <p>
          <vue-ckeditor v-model="pageText" :config="config" />
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
  props: ['country_code', 'language_iso', 'template', 'cssFORMATTED' ],
  components: {
    NavBar,
    VueCkeditor
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      authorized: false,
      content: {},
      config: {
        extraPlugins: ['bidi', 'uploadimage', 'uploadwidget', 'clipboard'],
        extraAllowedContent: 'ol(*)',
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
      console.log('looking for template')
      var res = await AuthorService.getTemplate(this.$route.params)
      console.log(res)
      if (res) {
        console.log('I found template')
        this.pageText = res
      }
    },
    async saveForm() {
      try {
        this.content.text = ContentService.validate(this.pageText)
        this.content.country_code = this.$route.params.country_code
        this.content.language_iso = this.$route.params.language_iso
        this.content.folder = this.bookmark.book.folder
        this.content.filename = this.$route.params.filename
        this.content.filetype = 'html'
        this.$router.push({
          name: 'editLibrary',
          params: {
            country_code: this.$route.params.country_code,
            language_iso: this.$route.params.language_iso,
            library_code: this.$route.params.library_code
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
    this.$route.params.cssFORMATTED = 'AU-styles-multiply.css'
    console.log(this.$route.params)
    var ok = false
    var styleSets = [
      'compass',
      'firststeps',
      'firststeps',
      'myfriends',
      'multiply'
    ]
    this.$route.params.styles_set = 'unknown'
    var arrayLength = styleSets.length
    for (var i = 0; i < arrayLength; i++) {
      if (this.$route.params.cssFORMATTED.includes(styleSets[i])) {
        this.$route.params.styles_set = styleSets[i]
      }
    }
    this.$route.params.version = 'lastest'
    this.$route.params.filename = this.$route.params.filename
    var css = this.$route.params.cssFORMATTED
    var clean = css.replace(/-/g, '/')
    this.$route.params.css = clean
    console.log('final params')
    console.log(this.$route.params)
  },
  async created() {
    try {
      this.authorized = this.authorize('write', this.$route.params.country_code)
      await this.loadTemplate()
      this.loaded = true
      this.loading = false
    } catch (error) {
      console.log('There was an error in Template.vue:', error)
    }
  }
}
</script>

<style scoped>
.float-right {
  text-align: right;
}
</style>
