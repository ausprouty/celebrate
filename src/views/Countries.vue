<template>
  <div>
    <h2>Select Country</h2>
    <Country v-for="country in countries" :key="country.code" :country="country"/>
  </div>
</template>

<script>
import Country from '@/components/Country.vue'
import DataService from '@/services/DataService.js'
export default {
  components: {
    Country
  },
  data() {
    return {
      countries: []
    }
  },
  created() {
    DataService.getCountries()
      .then(response => {
        console.log(response.data) // For now, logs out the response
        this.countries = response.data
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>

<style>
</style>
