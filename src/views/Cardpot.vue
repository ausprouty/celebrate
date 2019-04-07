<template>
  <div>
    <NavBar/>

    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Languages for {{this.$route.params.countryCODE}}</h1>
      <div>
        <div v-for="(language, index) in languages" :key="language.id" :language="language">
          
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteLanguageForm(index)">X</div>
            <h4 class="card-title">Language #{{index}}</h4>
            <form @submit.prevent="saveForm">
              <BaseInput
                v-model="language.name"
                label="Language Name (as you want your audience to see it)"
                type="text"
                placeholder="Language Name"
                class="field"
                :class="{ error: $v.language.name.$error }"
                @blur="$v.language.name.$touch()"
              />
              <template v-if="$v.language.name.$error">
                <p v-if="!$v.language.name.required" class="errorMessage">Language Name is required</p>
              </template>

              <BaseInput
                v-model="language.iso"
                label="Language 3 letter ISO"
                type="text"
                placeholder="3 letter ISO code"
                :class="{ error: $v.language.iso.$error }"
                @blur="$v.language.iso.$touch()"
              />
              <template v-if="$v.language.iso.$error">
                <p v-if="!$v.language.iso.required" class="errorMessage">Language ISO is required</p>
              </template>

              <span>Menu Images:</span>
              <select v-model="language.image_dir">
                <option disabled value>Menu Images:</option>
                <option value="menu-china">China</option>
                <option value="menu-ethiopian">Ethiopian</option>
                <option value="menu-europe">Europe</option>
                <option value="menu-india">India</option>
                <option value="menu-latin">Latin America</option>
                <option value="menu-middle_east">Middle East</option>
              </select>
              <span>Text Direction:</span>
              <select v-model="language.rldir">
                <option disabled value>Text Direction</option>
                <option value="ltr">Left to Right</option>
                <option value="rtl">Right to Left</option>
              </select>
            </form>
          </div>
        </div>
      </div>
    </div>
    <BaseButton type="submit" buttonClass="-fill-gradient" >Save Changes</BaseButton>
    <p v-if="$v.$anyError" class="errorMessage">Please fill out the required field(s).</p>
    <button class="button" @click="addNewLanguageForm">New Language</button>
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
  validations: {
    language: {
      name: { required },
      iso: { required },
      image_dir: { required },
      lrdir: { required }
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
        var valid = ContentService.validate(this.languages)
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
