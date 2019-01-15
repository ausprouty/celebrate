<template>
  <div>
    <h1>This is my discussion outline for {{ page}}</h1>
    {{pageText}}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DataService from '@/services/DataService.js'
export default {
  props: ['country', 'langauge', 'series', 'page'],
  computed: mapState(['bookmark', 'imgDir']),
   data() {
    return {
      pageText: ''
    }
  },
  created() {
    DataService.page(this.country, this.language, this.series, this.page)
      .then(response => {
        console.log('page in Page.Vue')
        console.log(response.data) // For now, logs out the response
        this.pageText = response.data

      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>
<style>

</style>
