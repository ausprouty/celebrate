<template>
  <div class="preview">
    <NavBar />
    <img v-bind:src="appDir.country + 'world.jpg'" class="app-img-header" />
    <div v-if="this.publish">
      <button class="button" @click="localPublish('prototype')">Prototype Again</button>
    </div>
    <div v-if="this.prototype">
      <button class="button" @click="localPublish('prototype')">Prototype</button>
    </div>
    <h1>Select Country (Preview Mode)</h1>
    <Country v-for="country in countries" :key="country.code" :country="country" />
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
import PrototypeService from '@/services/PrototypeService.js'
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
    async localPublish(location) {
      var response = null
      var params = {}
      params.recnum = this.recnum
      params.bookmark = JSON.stringify(this.bookmark)
      params.route = JSON.stringify(this.$route.params)
      if (location == 'prototype') {
        response = await PrototypeService.publish('countries', params)
      } else {
        response = await PublishService.publish('countries', params)
      }

      if (response['error']) {
        this.error = response['message']
        this.loaded = false
      } else {
        this.UnsetBookmarks()
        this.recnum = null
        this.loaded = false
        this.loading = true
        this.publish = false
        await this.loadView()
      }
    },
    async loadView() {
      try {
        await this.getCountries()
        this.publish = false
        this.prototype = false
        if (this.recnum && !this.publish_date && this.prototype_date) {
          this.publish = this.authorize('publish', 'country')
        }
        if (this.recnum && !this.prototype_date) {
          console.log('I am checking for prototype')
          this.prototype = this.authorize('publish', 'country')
        }
        this.authorized = this.authorize('write', 'country')
      } catch (error) {
        console.log('There was an error in Countries.vue:', error) // Logs out the error
      }
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
  created() {
    this.loadView()
  }
}
</script>

<style></style>
