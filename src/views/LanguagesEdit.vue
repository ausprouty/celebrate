<template>
  <div>
    <NavBar />

    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">
      There was an error... {{ this.error_message }}
    </div>
    <div class="content" v-if="loaded">
      <div v-if="this.authorized">
        <h1>
          Languages for {{ this.$route.params.country_code }}
          <a
            target="_blank"
            class="help"
            href="https://prototype.myfriends.network/content/HD/eng/help-1/languages_edit.html"
          >
            <img class="help-icon" src="/images/icons/help.png" />
          </a>
        </h1>
        <div class="form">
          <BaseInput
            v-model="choose_language"
            label="Choose Language:"
            type="text"
            placeholder="Choose Language"
            class="field"
          />
        </div>
        <div class="form">
          <BaseInput
            v-model="more_languages"
            label="More Languages:"
            type="text"
            placeholder="More Languages"
            class="field"
          />
        </div>
        <br />
        <hr />
        <div>
          <button class="button" @click="publishAll">
            Select ALL to publish?
          </button>
          <LanguageEdit
            v-for="language in $v.languages.$each.$iter"
            :key="language.id"
            :language="language"
          />
          <button class="button" @click="addNewLanguageForm">
            New Language
          </button>
        </div>
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
import LanguageEdit from '@/components/LanguageEdit.vue'
import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'

import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'

import { languageMixin } from '@/mixins/LanguageMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
import { required } from 'vuelidate/lib/validators'
//import { validFoldername } from '@/validators/Validator.js'
export default {
  mixins: [bookMarkMixin, languageMixin, authorMixin],
  props: ['country_code'],
  components: {
    NavBar,
    LanguageEdit
  },
  computed: mapState(['bookmark', 'appDir']),
  data() {
    return {
      choose_language: 'Choose Language',
      more_languages: 'More Languages',
      languages: {
        name: null,
        iso: null,
        folder: null,
        image_dir: null,
        titles: null,
        lrdir: null,
        custom: null,
        download: 'Download for offline use',
        download_ready: 'Ready for offline use',
        read_more: 'Read More',
        bible_nt: null,
        bible_ot: null,
        publish: null
      },

      authorized: false
    }
  },
  validations: {
    languages: {
      required,
      $each: {
        name: { required },
        iso: { required },
        folder: { required },
        image_dir: { required },
        custom: {},
        download: {},
        download_ready: {},
        read_more: {},
        bible_nt: {},
        bible_ot: {},
        titles: {},
        rldir: {},
        publish: {}
      }
    }
  },
  methods: {
    addNewLanguageForm() {
      if (!this.languages) {
        this.languages = []
      }
      this.languages.push({
        id: null,
        folder: null,
        iso: null,
        name: null,
        image_dir: null,
        custom: null,
        bible_ot: null,
        bible_nt: null,
        titles: null,
        rldir: 'ltr'
      })
    },
    publishAll() {
      var arrayLength = this.languages.length
      console.log(' Item count:' + arrayLength)
      for (var i = 0; i < arrayLength; i++) {
        this.$v.languages.$each.$iter[i].publish.$model = true
      }
    },

    async saveForm() {
      try {
        this.$store.dispatch('newBookmark', 'clear')
        var output = {}
        output.languages = this.languages
        output.more_languages = this.more_languages
        output.choose_language = this.choose_language
        console.log('output')
        console.log(output)
        var valid = ContentService.validate(output)
        this.content.text = JSON.stringify(valid)
        this.$route.params.filename = 'languages'
        this.content.filetype = 'json'
        this.content.route = JSON.stringify(this.$route.params)
       
        console.log('going to directory languages')
        console.log(this.content)
        AuthorService.createDirectoryLanguages(this.content)
        var response = await AuthorService.createContentData(this.content)
        if (response.data.error != true) {
          this.$router.push({
            name: 'previewLanguages',
            params: {
              country_code: this.$route.params.country_code
            }
          })
        } else {
          this.error = true
          this.loaded = false
          this.error_message = response.data.message
        }
      } catch (error) {
        console.log('LANGUAGES EDIT There was an error ', error)
        this.error = true
        this.loaded = false
        this.error_message = error
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      this.authorized = this.authorize('write', this.$route.params.country_code)
      console.log('this authorized')
      if (this.authorized) {
        //   this.image_folders = await AuthorService.getFoldersImages()
        //  console.log(this.image_folders)
        //  this.content_folders = await AuthorService.getContentFoldersForLanguage()
        //  console.log(this.content_folders)
        await this.getLanguages(this.$route.params)
      }
      this.loaded = true
      this.loading = false
    } catch (error) {
      console.log('There was an error in LanguagesEdit.vue:', error) // Logs out the error
    }
  }
}
</script>

<style scoped>
.float-right {
  text-align: right;
}
</style>
