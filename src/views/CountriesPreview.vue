<template>
  <div class="preview">
    <NavBar/>
    <img v-bind:src="appDir.country+'world.jpg'" class="app-img-header">
    <h1>Select Country (Preview Mode)</h1>
    <Country v-for="country in countries" :key="country.code" :country="country"/>
    <div class="version">
      <p class="version">Version 1.01</p>
      <button class="button" @click="editCountries">Edit</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button class="button" @click="sortCountries">Sort</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import Country from '@/components/CountryPreview.vue'

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
        folder: '',
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
    },
    sortCountries() {
      this.$router.push({
        name: 'sortCountries'
      })
    },
    goBack() {
      window.history.back()
    },
    toFormData(obj) {
      var form_data = new FormData()
      for (var key in obj) {
        form_data.append(key, obj[key])
      }
      console.log('form_data')
      // Display the key/value pairs
      for (var pair of form_data.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }
      return form_data
    }
  },
  async created() {
    var ref = this
    console.log('going to getCountries')
    let promise = ContentService.getCountries('latest')
    let response = await promise
    console.log('in Countries Preview response from getCountries')
    console.log(response)
    var text = JSON.parse(response.data.content.text)
    var d = new Date()
    var now = d.getTime()
    var uid = 1
    var publish_uid = uid
    var publish_date = now
    if (typeof response.data.content.publish_uid !== 'undefined') {
      publish_uid = response.data.content.publish_uid
      publish_date = response.data.content.publish_date
    }
    ref.content = {}
    ref.content.recnum = ''
    ref.content.version = ''
    ref.content.publish_uid = publish_uid
    ref.content.publish_date = publish_date
    ref.content.language_iso = ''
    ref.content.country_iso = ''
    ref.content.folder = ''
    ref.content.filetype = 'json'
    ref.content.title = ''
    ref.content.filename = 'countries'
    ref.content.countries = text
    ref.loading = false
    ref.countries = text
    console.log(ref.content.countries)
  }
}
</script>

<style>
</style>
