<template>
  <div>
    <h1>Choose Language</h1>
    <Language v-for="language in languages" :key="language.iso" :language="language"/>
  </div>
</template>

<script>
import Language from '@/components/Language.vue'
import DataService from '@/services/DataService.js'
export default {
  props: ['country'],
  components: {
    Language
  },
  data() {
    return {
      languages: []
    }
  },
  created() {
    DataService.getLanguages(this.country)
      .then(response => {
        console.log(response.data) // For now, logs out the response
        this.languages = response.data
        console.log(this.languages)
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>


<style>
</style>
