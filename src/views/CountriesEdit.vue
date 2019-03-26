<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Countries</h1>
      <div>
        <button class="button" @click="addNewCountryForm">New Country</button>
        <div v-for="(country, index) in countries" :key="country.code" :country="country">
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteCountryForm(index)">X</div>
            <h4 class="card-title">Country #{{index}}</h4>
            <div class="form">
              <span>Country Name :</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Country Name"
                v-model="country.name"
              >
              <span>English Name:</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="English Name"
                v-model="country.english"
              >
              <span>country 2 letter ISO:</span>
              <input
                type="text"
                maxlength="2"
                class="form-control mb-2"
                placeholder="2 letter ISO code"
                v-model="country.code"
              >
              <span>Index</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="index-ISO"
                v-model="country.english"
              >
              <span>Image</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="ISO.png"
                v-model="country.image"
              >
            </div>
          </div>
        </div>
        <button class="button" @click="saveForm">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import { mapState } from 'vuex'
export default {
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'revision']),
  data() {
    return {
      countries: [
        {
          code: '',
          english: '',
          name: '',
          index: ''
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
    deleteCountryForm(index) {
      this.countries.splice(index, 1)
    },
    addNewCountryForm() {
      this.countries.push({
        code: '',
        english: '',
        name: '',
        index: ''
      })
    },
    saveForm() {
      console.log(this.content)
      this.content.text = JSON.stringify(this.countries)
      this.content.filename = 'countries'
      this.content.filetype = 'json'
      var contentForm = ContentService.toFormData(this.content)
      var ref = this
      // clear bookmark because we are editing details
      this.$store.dispatch('newBookmark', 'clear')
      ContentService.createContentData(contentForm).then(function(response) {
        if (response.data.error) {
          ref.errorMessage = response.data.message
        } else {
          // this.successMessage = response.data.message
          //ref.getCountries()
          ref.$router.push({
            name: 'previewCountries'
          })
        }
      })
    },
    getCountries() {
      this.error = this.loaded = null
      this.loading = true
      this.countries = []
      var ref = this
      console.log('about to get countries ')
      ContentService.getCountries(this.$route.params)
        .then(response => {
          console.log('response')
          console.log(response.data)
          if (response.data.content == 'none') {
            ContentService.getCountries().then(response => {
              console.log('lookig for old data')
              ref.countries = response.data
              ref.loaded = true
              ref.loading = false
            })
          } else {
            ref.content.recnum = ''
            ref.content.version = ''
            ref.content.publish_uid = ''
            ref.content.publish_date = ''
            ref.content.language_iso = ''
            ref.content.country_iso = ''
            ref.content.folder = ''
            ref.content.filetype = 'json'
            ref.content.title = ''
            ref.content.filename = 'countries'
            ref.content.countries = JSON.parse(response.data.content.text)
            ref.loaded = true
            ref.loading = false
            this.countries = ref.content.countries
            console.log(ref.content.countries)
          }
        })
        .catch(() => {
          console.log('There was a problem finding countries in ')
        })
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
    this.$store.dispatch('checkBookmark', this.$route.params)
  },
  created() {
    this.getCountries()
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
