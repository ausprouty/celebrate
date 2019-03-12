<template>
  <div class="preview">
    <NavBar/>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <img v-bind:src="appDir.root+'languages.jpg'" class="app-img-header">

      <h1>Choose Language (preview for {{this.countryCODE}})</h1>
      <Language v-for="language in languages" :key="language.iso" :language="language"/>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
    <button class="button" @click="editLanguages">Edit</button>
  </div>
</template>

<script>
import Language from '@/components/LanguagePreview.vue'
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
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
  methods: {
    editLanguages() {
      this.$router.push({
        name: 'editLanguages',
        params: {
          countryCODE: this.countryCODE
        }
      })
    },
    goBack() {
      window.history.back()
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
    var ref = this
    route.country = this.countryCODE
    console.log('Entered Languages.vue')
    this.$store.dispatch('checkBookmark', route, 'latest').then(responseUnused => {
      console.log('about to get languages for ' + this.countryCODE)
      ContentService.getLanguages(ref.countryCODE)
        .then(response => {
          console.log(response)
          if (!response.data.content) {
            ContentService.getLanguages(route.country).then(response => {
              this.languages = response.data
              this.loaded = true
              this.loading = false
            })
          } else {
            ref.languages = JSON.parse(response.data.content.text)
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
