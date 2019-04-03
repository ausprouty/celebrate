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
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { countriesMixin } from '@/mixins/CountriesMixin.js'
export default {
  mixins: [bookMarkMixin, countriesMixin],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'revision']),

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
    async saveForm() {
      try {
        this.$store.dispatch('newBookmark', 'clear')
        var valid = ContentService.valid (this.countries)
        this.content.text = JSON.stringify(valid)
        this.content.filename = 'countries'
        this.content.filetype = 'json'
        await ContentService.createContentData(this.content)
        this.$router.push({
          name: 'previewCountries'
        })
      } catch (error) {
        console.log('COUNTRIES EDIT There was an error ', error) //
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      await this.getCountries()
    } catch (error) {
      console.log('There was an error in CountriesEdit.vue:', error) // Logs out the error
    }
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
