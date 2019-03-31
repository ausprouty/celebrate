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
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
export default {
  mixins: [bookMarkMixin],

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
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      await this.CheckBookmarks(this.$route.params)
      var response = await ContentService.getCountries(this.$route.params)
      this.countries = response.data.content.text
    } catch (error) {
      console.log('There was an error in Countries.vue:', error) // Logs out the error
    }
  }
}
</script>

<style>
</style>
