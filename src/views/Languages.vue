<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <img v-bind:src="appDir.root+'languages.jpg'" class="app-img-header">

      <h1>Choose Language</h1>
      <Language v-for="language in languages" :key="language.iso" :language="language"/>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
  </div>
</template>

<script>
import Language from '@/components/Language.vue'
import NavBar from '@/components/NavBarHamburger.vue'
import DataService from '@/services/DataService.js'
import { mapState } from 'vuex'
export default {
  props: ['countryCODE'],
  components: {
    Language,
    NavBar
  },
  computed: mapState(['bookmark', 'appDir']),
  data() {
    return {
      loadinG: false,
      language: [],
      languages: [
        {
          id: '',
          folder: '',
          iso: '',
          name: '',
          image_dir: '',
          rldir: 'ltr'
        }
      ],
      loading: false,
      loaded: null,
      error: null
    }
  },
  created() {
    /* Update bookmark based on this route (for people to select URL from another source)
       Bookmark stores current Country and all specialized info for that country
      If there is only one language for this country we then go back to country
    */
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.countryCODE
    console.log('Entered Languages.vue')
    this.$store.dispatch('checkBookmark', route).then(responseUnused => {
      console.log('about to get languages for ' + this.countryCODE)
      DataService.getLanguages(this.countryCODE)
        .then(response => {
          this.languages = response.data
          if (response.data.length === 1) {
            this.$router.push({
              name: 'countries'
            })
          } else {
            this.loaded = true
            this.loading = false
          }
        })
        .catch(() => {
          console.log('There was a problem finding language')
        })
    })
  }
}
</script>


<style>
</style>
