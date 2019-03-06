<template>
  <div class = "preview">
    <NavBar/>
    <img v-bind:src="appDir.country+'world.jpg'" class="app-img-header">
    <h1>Select Country (Preview Mode)</h1>
    <Country v-for="country in countries" :key="country.code" :country="country"/>
    <div class="version">
      <p class="version">Version 1.01</p>
      <button class="button" @click="editCountries">Edit</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBarFront.vue'
import Country from '@/components/CountryPreview.vue'
import EditService from '@/services/EditService.js'
export default {
  components: {
    Country,
    NavBar
  },
  computed: mapState(['appDir']),
  data() {
    return {
      countries: [],
      content: {
        recnum: '',
        version: '',
        edit_date: '',
        edit_uid: '',
        publish_uid: '',
        publish_date: '',
        language_iso: '',
        country_iso: '',
        section: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      }
    }
  },
  methods: {
    editCountries() {
      this.$router.push({
        name: 'editCountries'
      })
    }
  },
  created() {
    var ref = this
    EditService.getCountries()
      .then(response => {
        ref.content.recnum = ''
        ref.content.version = ''
        ref.content.publish_uid = response.data.content.publish_uid
        ref.content.publish_date = response.data.content.publish_date
        ref.content.language_iso = ''
        ref.content.country_iso = ''
        ref.content.section = ''
        ref.content.filetype = 'json'
        ref.content.title = ''
        ref.content.filename = 'countries'
        ref.content.countries = JSON.parse(response.data.content.text)
        ref.loaded = true
        ref.loading = false
        this.countries = ref.content.countries
        console.log(ref.content.countries)
      })
      .catch(error => {
        console.log(
          'There was an error in CountriesPreview.vue:',
          error.response
        ) // Logs out the error
      })
  }
}
</script>

<style>
</style>
