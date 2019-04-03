<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Languages for {{this.$route.params.countryCODE}}</h1>
      <div>
        <button class="button" @click="addNewLanguageForm">New Language</button>
        <div v-for="(language, index) in languages" :key="language.id" :language="language">
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteLanguageForm(index)">X</div>
            <h4 class="card-title">Language #{{index}}</h4>
            <div class="form">
              <span>Language Name (as you want your audience to see it):</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Language Name"
                v-model="language.name"
              >
              <span>Language 3 letter ISO:</span>
              <input
                type="text"
                maxlength="3"
                class="form-control mb-2"
                placeholder="3 letter ISO code"
                v-model="language.iso"
              >
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="button" @click="saveForm">Save</button>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { languageMixin } from '@/mixins/LanguageMixin.js'
export default {
  mixins: [bookMarkMixin, languageMixin],
  props: ['countryCODE'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir']),
  
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
    saveForm() {
      console.log(this.content)
      this.content.text = JSON.stringify(this.languages)
      this.content.filename = 'languages'
      this.content.filetype = 'json'
      this.content.country_iso = this.$route.params.countryCODE
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
            name: 'previewLanguages',
            params: {
              countryCODE: ref.$route.params.countryCODE
            }
          })
        }
      })
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      this.getLanguages()
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
