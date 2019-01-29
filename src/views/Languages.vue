<template>
  <div>
    <a href="/">
      <img v-bind:src="appDir.root+'languages.jpg'" class="app-img-header">
      <img v-bind:src="appDir.root+'backbar.png'" class="app-img-header">
    </a>
    <h1>Choose Language</h1>
    <Language v-for="language in languages" :key="language.iso" :language="language"/>
    <div class="version">
      <p class="version">Version 1.01</p>
    </div>
  </div>
</template>

<script>
import Language from '@/components/Language.vue'
import DataService from '@/services/DataService.js'
import { mapState } from 'vuex'
export default {
  props: ['countryCODE'],
  components: {
    Language
  },
  computed: mapState(['bookmark', 'appDir']),
  data() {
    return {
      languages: []
    }
  },
  created() {
    /* Update bookmark based on this route (for people to select URL from another source)
       Bookmark stores current Country and all specialized info for that country

      If there is only one language for this country we then push through to its library
    */
    var route = {}
    route.country = this.countryCODE
    console.log('Entered Languages.vue')
    this.$store
      .dispatch('checkBookmark', route)
      .then(responseUnused => {
        console.log('about to get languages for ' + this.countryCODE)
        DataService.getLanguages(this.countryCODE).then(response => {
          console.log('response from getLanguages for ' + this.countryCODE)
          console.log(response.data) // For now, logs out the response
          //  console.log('length is ' + response.data.length)
          this.languages = response.data
          if (response.data.length === 1) {
            var language = response.data[0]
            //    console.log('language is ')
            //    console.log(language)
            this.$store
              .dispatch('updateBookmark', ['language', language])
              .then(() => {
                //        console.log('language_iso is ' + language.iso)
                this.$router.push({
                  name: 'library',
                  params: {
                    countryCODE: this.countryCODE,
                    languageISO: language.iso
                  }
                })
              })
              .catch(() => {
                console.log('There was a problem storing language')
              })
          }
        })
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>


<style>
</style>
