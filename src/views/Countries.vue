<template>
  <div>
    <NavBar/>
    <img v-bind:src="appDir.country+'world.jpg'" class="app-img-header">
    <h1>Select Country</h1>
    <Country v-for="country in countries" :key="country.code" :country="country"/>
    <div class="version">
      <p class="version">Version 1.01</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBarFront.vue'
import Country from '@/components/Country.vue'
import ContentService from '@/services/ContentService.js'
export default {
  components: {
    Country,
    NavBar
  },
  computed: mapState(['appDir']),
  data() {
    return {
      countries: []
    }
  },
  created() {
    ContentService.getCountries()
      .then(response => {
        console.log(response.data) // For now, logs out the response
        this.countries = response.data
      })
      .catch(error => {
        console.log('There was an error in Countries.vue:', error.response) // Logs out the error
      })
  }
}
</script>

<style>
</style>
