<template>
  <div>
    <NavBar />

    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">
      There was an error... {{ this.error_message }}
    </div>
    <div class="content" v-if="loaded">
      <div v-if="this.authorized">
        <h1>Languages for {{ this.$route.params.country_code }}</h1>
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
          <div
            v-for="(language, index) in $v.languages.$each.$iter"
            :key="language.id"
            :language="language"
          >
            <div
              class="app-card -shadow"
              v-bind:class="{ notpublished: !language.publish.$model }"
            >
              <div
                class="float-right"
                style="cursor:pointer"
                @click="deleteLanguageForm(index)"
              >
                X
              </div>
              <form @submit.prevent="saveForm">
                <BaseInput
                  v-model="language.name.$model"
                  label="Language Name (as you want your audience to see it)"
                  type="text"
                  placeholder="Language Name"
                  class="field"
                  :class="{ error: language.name.$error }"
                  @blur="language.name.$touch()"
                />
                <template v-if="language.name.$error">
                  <p v-if="!language.name.required" class="errorMessage">
                    Language Name is required
                  </p>
                </template>

                <div v-if="!language.iso.$model">
                  <p>
                    <a
                      target="a_blank"
                      href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes"
                      >Reference File</a
                    >
                  </p>
                </div>
                <BaseInput
                  v-model="language.iso.$model"
                  label="Language 3 letter ISO"
                  type="text"
                  placeholder="3 letter ISO code"
                  class="field"
                  :class="{ error: language.iso.$error }"
                  @blur="language.iso.$touch()"
                  @input="forceLowerISO(language.iso.$model)"
                />
                <template v-if="language.iso.$error">
                  <p v-if="!language.iso.required" class="errorMessage">
                    Language ISO is required
                  </p>
                </template>

                <div v-if="language.iso.$model">
                  <BaseSelect
                    label="Content Folder"
                    :options="content_folders"
                    v-model="language.folder.$model"
                    class="field"
                    :class="{ error: language.folder.$error }"
                    @blur="language.folder.$touch()"
                  />
                  <div>
                    <p>
                      <a @click="setupLanguageFolder(language.iso.$model)"
                        >Create new content folder</a
                      >
                    </p>
                  </div>
                  <template v-if="language.folder.$error">
                    <p v-if="!language.folder.required" class="errorMessage">
                      Content folder is required
                    </p>
                  </template>
                </div>
                <div v-if="language.folder.$model">
                  <BaseSelect
                    label="Library Image Folder"
                    :options="image_folders"
                    v-model="language.image_dir.$model"
                    class="field"
                    :class="{ error: language.image_dir.$error }"
                    @blur="language.image_dir.$touch()"
                  />

                  <div>
                    <p>
                      <a @click="setupImageFolder(language.iso.$model)"
                        >Create new image folder</a
                      >
                    </p>
                  </div>
                  <template v-if="language.image_dir.$error">
                    <p v-if="!language.image_dir.required" class="errorMessage">
                      Menu directory is required
                    </p>
                  </template>
                  <input
                    type="checkbox"
                    id="checkbox"
                    v-model="language.titles.$model"
                  />
                  <label for="checkbox">
                    <p>Images contain Titles</p>
                  </label>
                  <BaseSelect
                    label="Text Direction"
                    :options="direction"
                    v-model="language.rldir.$model"
                    class="field"
                  />
                  <br />
                  <br />
                  <input
                    type="checkbox"
                    id="checkbox"
                    v-model="language.publish.$model"
                  />
                  <label for="checkbox">
                    <h2>Publish?</h2>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div>
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
    NavBar
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
        publish: null
      },
      image_folders: [],
      content_folders: [],
      direction: ['rtl', 'ltr'],
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
    deleteLanguageForm(index) {
      this.languages.splice(index, 1)
    },
    forceLowerISO(value) {
      var change = this.$v.languages.$model
      var arrayLength = change.length
      for (var i = 0; i < arrayLength; i++) {
        var checkfile = this.$v.languages.$model[i]
        if (checkfile.iso == value) {
          this.$v.languages.$each[i].$model.iso = value.toLowerCase()
        }
      }
    },
    async setupLanguageFolder(iso) {
      AuthorService.setupLanguageFolder(
        this.$route.params.country_code,
        iso.toLowerCase()
      )
      console.log(this.$v.languages.$model)
      var change = this.$v.languages.$model
      var arrayLength = change.length
      // console.log(arrayLength)
      for (var i = 0; i < arrayLength; i++) {
        var checkfile = this.$v.languages.$model[i]
        if (checkfile.iso == iso) {
          this.$v.languages.$each[i].$model.image_dir = iso.toLowerCase()
          console.log(checkfile)
          this.content_folders = await AuthorService.getFoldersLanguage()
        }
      }
    },
    async setupImageFolder(iso) {
      AuthorService.setupImageFolder(this.$route.params.country_code, iso)
      console.log(this.$v.languages.$model)
      var change = this.$v.languages.$model
      var arrayLength = change.length
      // console.log(arrayLength)
      for (var i = 0; i < arrayLength; i++) {
        var checkfile = this.$v.languages.$model[i]
        if (checkfile.iso == iso) {
          this.$v.languages.$each[i].$model.image_dir = iso
          console.log(checkfile)
          this.image_folders = await AuthorService.getFoldersImages()
        }
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
        this.content.route = JSON.stringify(this.$route.params)
        this.content.filetype = 'json'
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
        this.image_folders = await AuthorService.getFoldersImages()
        console.log(this.image_folders)
        this.content_folders = await AuthorService.getFoldersLanguage()
        console.log(this.content_folders)
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
