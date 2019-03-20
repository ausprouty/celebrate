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
export default {
  props: ['countryCODE'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir']),
  data() {
    return {
      language: [],
      languages: [
        {
          id: '',
          folder: '',
          iso: '',
          name: '',
          image_dir: '',
          rldir: 'ltr'
        }
      ],
      loading: false,
      loaded: null,
      error: null,
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
      var contentForm = this.toFormData(this.content)
      var ref = this
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
    },
    toFormData(obj) {
      this.content.edit_date = ''
      this.content.edit_uid = ''
      var form_data = new FormData()
      for (var key in obj) {
        form_data.append(key, obj[key])
      }
      this.content.text = ''
      console.log('form_data')
      // Display the key/value pairs
      for (var pair of form_data.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }
      return form_data
    }
  },
  created() {
    /* Update bookmark based on this route (for people to select URL from another source)
       Bookmark stores current Country and all specialized info for that country
      If there is only one language for this country we then go back to country
    */
    this.error = this.loaded = null
    this.loading = true
    this.languages = []
    var route = {}
    route.country = this.$route.params.countryCODE
    route.version = 'latest'
    console.log('Entered LanguageEdits.vue')
    console.log(this.$route.params.countryCODE)
    this.$store.dispatch('checkBookmark', route).then(responseUnused => {
      console.log('about to get languages for ' + route.country)
      ContentService.getLanguages(route.country, route.version)
         .then(response => {
          console.log('LANGUAGES SORT -  response data')
          console.log(response)
          if (response.content.text) {
             console.log('LANGUAGES SORT -  response.content.text exists')
            this.languages = JSON.parse(response.content.text)
          } else {
            this.languages = response.data
          }
          this.loaded = true
          this.loading = false
        })
        .catch(() => {
          console.log('There was a problem finding language')
        })
    })
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
