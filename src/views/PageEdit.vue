<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <link rel="stylesheet" v-bind:href="'/css/' + this.bookmark.book.style">
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

      <h1 v-if="this.bookmark.page.count">{{this.bookmark.page.count}}. {{this.bookmark.page.title}}</h1>
      <h1 v-else>{{this.bookmark.page.title}}</h1>
      <p>
        <vue-ckeditor v-model="htmlText" language="en"></vue-ckeditor>
      </p>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
    <button class="button" @click="saveForm">Save</button>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import './ckeditor/index.js'
import VueCkeditor from 'vueckeditor'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { pageMixin } from '@/mixins/PageMixin.js'
export default {
  mixins: [bookMarkMixin, pageMixin],
  props: ['countryCODE', 'languageISO', 'bookNAME', 'fileFILENAME'],
  components: {
    NavBar,
    VueCkeditor
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      pageText: '',
      loading: false,
      loaded: null,
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
        country_iso: '',
        folder: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      }
    }
  },
  methods: {
    goBack() {
      window.history.back()
    },
    saveForm() {
      console.log(this.content)
      this.content.text = this.htmlText
      this.content.country_iso = this.$route.params.countryCODE
      this.content.language_iso = this.$route.params.languageISO
      this.content.folder = this.bookmark.book.folder
      this.content.filename = this.$route.params.pageFILENAME
      this.content.filetype = 'html'
      console.log('PAGE EDIT - content')
      console.log(this.content)
      var contentForm = ContentService.toFormData(this.content)
      var ref = this
      // clear bookmark because we are editing details
      this.$store.dispatch('newBookmark', 'clear')
      //
      ContentService.createContentData(contentForm).then(function(response) {
        if (response.data.error) {
          ref.errorMessage = response.data.message
        } else {
          // this.successMessage = response.data.message
          //ref.getCountries()
          ref.$router.push({
            name: 'previewPage',
            params: {
              countryCODE: ref.$route.params.countryCODE,
              languageISO: ref.$route.params.languageISO,
              folderNAME: ref.$route.params.folderNAME,
              pageFILENAME: ref.$route.params.pageFILENAME
            }
          })
        }
      })
    },

    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)

      var formData = new FormData()
      formData.append('image', file)

      axios({
        url: 'https://fakeapi.yoursite.com/images',
        method: 'POST',
        data: formData
      })
        .then(result => {
          let url = result.data.url // Get url from response
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  beforeCreate() {
    this.$route.params.version = 'current'
  },
  async created() {
    try {
      console.log('PAGE VIEW - route')
      console.log(this.$route.params)
      //  this.getPage(this.$route.params)
    } catch (error) {
      console.log('There was an error in Page.vue:', error) // Logs out the error
    }
  }
}
</script>
<style >
</style>


<style scoped>
.float-right {
  text-align: right;
}
</style>
