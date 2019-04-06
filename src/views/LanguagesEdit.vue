<template>
  <div>
    <NavBar/>

    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Languages for {{this.$route.params.countryCODE}}</h1>
      <div>
        <div
          v-for="(language, index) in $v.languages.$each.$iter"
          :key="language.id"
          :language="language"
        >
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteLanguageForm(index)">X</div>
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
                <p v-if="!language.name.required" class="errorMessage">Language Name is required</p>
              </template>

              <BaseInput
                v-model="language.iso.$model"
                label="Language 3 letter ISO"
                type="text"
                placeholder="3 letter ISO code"
                class="field"
                :class="{ error: language.iso.$error }"
                @blur="language.iso.$touch()"
              />
              <template v-if="language.iso.$error">
                <p v-if="!language.iso.required" class="errorMessage">Language ISO is required</p>
              </template>
              <BaseSelect
                label="Menu Images"
                :options="menus"
                v-model="language.image_dir.$model"
                class="field"
                :class="{ error: language.image_dir.$error }"
                @blur="language.image_dir.$touch()"
              />
              <template v-if="language.image_dir.$error">
                <p
                  v-if="!language.image_dir.required"
                  class="errorMessage"
                >Menu directory is required</p>
              </template>
              <BaseSelect
                label="Text Direction"
                :options="direction"
                v-model="language.rldir.$model"
                class="field"
                :class="{ error: language.rldir.$error }"
                @blur="language.rldir.$touch()"
              />
              <template v-if="language.rldir.$error">
                <p v-if="!language.rldir.required" class="errorMessage">Text Direction is required</p>
              </template>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div>
      <button class="button" @click="addNewLanguageForm">New Language</button>
    </div>
    <div v-if="!$v.$anyError">
      <button class="button red" @click="saveForm">Save Changes</button>
    </div>
    <div v-if="$v.$anyError">
      <button class="button grey">Disabled</button>
      <p v-if="$v.$anyError" class="errorMessage">Please fill out the required field(s).</p>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { languageMixin } from '@/mixins/LanguageMixin.js'
import { required } from 'vuelidate/lib/validators'
export default {
  mixins: [bookMarkMixin, languageMixin],
  props: ['countryCODE'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir']),
  data() {
    return {
      languages: {
        name: '',
        iso: '',
        image_dir: '',
        lrdir: ''
      },
      menus: [
        'menu-china',
        'menu-ethiopian',
        'menu-europe',
        'menu-india',
        'menu-latin',
        'menu-middle_east'
      ],
      direction: ['rtl', 'ltr']
    }
  },
  validations: {
    languages: {
      required,
      $each: {
        name: { required },
        iso: { required },
        image_dir: { required },
        rldir: { required }
      }
    }
  },
  methods: {
    addNewLanguageForm() {
      this.languages.push({
        id: '',
        folder: '',
        iso: '',
        name: '',
        image_dir: '',
        rldir: 'ltr'
      })
    },
    deleteLanguageForm(index) {
      this.languages.splice(index, 1)
    },
    async saveForm() {
      try {
        this.$store.dispatch('newBookmark', 'clear')
        var valid = ContentService.valid(this.languages)
        this.content.text = JSON.stringify(valid)
        this.content.filename = 'languages'
        this.content.filetype = 'json'
        this.content.country_iso = this.$route.params.countryCODE
        await ContentService.createContentData(this.content)
        this.$router.push({
          name: 'previewLanguages',
          params: {
            countryCODE: this.$route.params.countryCODE
          }
        })
      } catch (error) {
        console.log('LANGUAGES EDIT There was an error ', error) //
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      await this.getLanguages()
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
