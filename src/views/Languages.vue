<template>
  <div>
    <h1>Choose Language</h1>
    <Language v-for="language in languages" :key="language.iso" :language="language"/>
  </div>
</template>

<script>
import Language from '@/components/Language.vue'
import DataService from '@/services/DataService.js'
import { mapState } from 'vuex'
export default {
  props: ['country'],
  components: {
    Language
  },
  computed: mapState(['bookmark']),
  data() {
    return {
      languages: []
    }
  },
  methods: {
    updateBookmark: function(language) {
      console.log('update Bookmark')
      console.log(language)
    }
  },
  created() {
    DataService.getLanguages(this.country)
      .then(response => {
        console.log(response.data) // For now, logs out the response
        this.languages = response.data
        if (response.data.length === 1) {
          console.log(response.data[0])
          var language = response.data[0]
          this.$store
            .dispatch('updateBookmark', ['language', language])
            .then(() => {
              console.log('results saved with bookmark value')
              console.log(this.bookmark)
              console.log('that was value')
              this.$router.push({
                name: 'library',
                params: {
                  country: this.bookmark.country.code,
                  folder: this.bookmark.language.folder
                }
              })
            })
            .catch(() => {
              console.log('There was a problem storing language')
            })
        }
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>


<style>
</style>
