<template>
  <div class="preview">
    <NavBar/>
    <img v-bind:src="appDir.country+'world.jpg'" class="app-img-header">
    <div v-if="this.publish">
        <button class="button" @click="this.publish('countries', this.$route.params)">Publish</button>
     </div>
    <h1>Select Country (Preview Mode)</h1>
    <Country v-for="country in countries" :key="country.code" :country="country"/>
    <p class="version">Version 1.01</p>
     
    <div v-if="this.authorized">
      <button class="button" @click="editCountries">Edit</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button class="button" @click="sortCountries">Sort</button>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex'
import { mapState } from 'vuex'
import NavBar from '@/components/NavBarAdmin.vue'
import Country from '@/components/CountryPreview.vue'
import PublishService from '@/services/PublishService.js'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { countriesMixin } from '@/mixins/CountriesMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'

export default {
  mixins: [bookMarkMixin, countriesMixin, authorMixin],
  components: {
    Country,
    NavBar
  },
  data() {
    return {
      authorized: false,
      publish: false
    }
  },
  computed: mapState(['appDir', 'user']),

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
      await this.getCountries()
      this.authorized = this.authorize('write', this.$route.params.countryCODE)
      this.publish = this.authorize('publish', this.$route.params.countryCODE)
    } catch (error) {
      console.log('There was an error in Countries.vue:', error) // Logs out the error
    }
  }
}
</script>

<style>
</style>
