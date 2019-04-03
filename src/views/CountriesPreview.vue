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
import Country from '@/components/CountryPreview.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { countriesMixin } from '@/mixins/CountriesMixin.js'

export default {
  mixins: [bookMarkMixin, countriesMixin],
  components: {
    Country,
    NavBar
  },
  computed: mapState(['appDir']),
  
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
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      this.getCountries()
    } catch (error) {
      console.log('There was an error in Countries.vue:', error) // Logs out the error
    }
  }
}
</script>

<style>
</style>
