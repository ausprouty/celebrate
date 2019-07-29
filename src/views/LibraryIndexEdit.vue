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
        <h1>
          {{ this.bookmark.language.name }} -- {{ this.bookmark.country.name }}
        </h1>
        <p>
          <vue-ckeditor v-model="pageText" :config="config" />
        </p>
        <hr />
        <h2> Language Footer Text</h2>
        <p>
          <vue-ckeditor v-model="footerText" :config="config" />
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
import NavBar from '@/components/NavBarCountry.vue'
import './ckeditor/index.js'
import VueCkeditor from 'vue-ckeditor2'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { libraryMixin } from '@/mixins/LibraryMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, libraryMixin, authorMixin],
  props: ['country_code', 'language_iso'],
  components: {
    NavBar,
    VueCkeditor
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      authorized: false,
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
        height: 600,
        removeButtons:
          'About,Button,Checkbox,CreatePlaceholder,DocProps,Flash,Form,HiddenField,NewPage,PageBreak,Preview,Print,Radio,Save,Scayt,Select,Smiley,SpecialChar,TextField,Textarea'
      }
    }
  },
  methods: {
    goBack() {
      window.history.back()
    },
    async loadTemplate() {
      this.authorized = this.authorize('write', this.$route.params.country_code)
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
        var text = {}
        text.page = ContentService.validate(this.pageText)
        text.footer = ContentService.validate(this.footerText)
        this.content.text = JSON.stringify(text)
        this.$route.params.filename = 'index'
        this.content.route = JSON.stringify(this.$route.params)

        this.content.filetype = 'html'
        this.$store.dispatch('newBookmark', 'clear')
        var response = await AuthorService.createContentData(this.content)
        if (response.data.error != true) {
          this.$router.push({
            name: 'previewLibraryIndex',
            params: {
              country_code: this.$route.params.country_code,
              language_iso: this.$route.params.language_iso
            }
          })
        } else {
          this.error = true
          this.loaded = false
          this.error_message = response.data.message
        }
      } catch (error) {
        console.log('COUNTRY PAGE EDIT There was an error ', error)
        this.error = true
        this.loaded = false
        this.error_message = error
      }
    }
  },
  async beforeCreate() {
    console.log('before Create in Country')
    console.log(this.$route.params)
    this.$route.params.styles_set = 'myfriends'
    this.$route.params.version = 'lastest'
    this.$route.params.filename = 'index'
    this.$route.params.css = 'AU/styles/AU-freeform.css'
    console.log('final params')
    console.log(this.$route.params)
  },
  async created() {
    try {
      console.log('in Created')
      console.log(this.$route)
      await this.getLibraryIndex()
      this.authorized = this.authorize('write', 'world')
      this.publish = false
      if (this.recnum && !this.publish_date) {
        this.publish = this.authorize('publish', 'country')
      }
    } catch (error) {
      console.log('There was an error in LanguageIndexEdit.vue:', error)
    }
  }
}
</script>

<style scoped>
.float-right {
  text-align: right;
}
</style>