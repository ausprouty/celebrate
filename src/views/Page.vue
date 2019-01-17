<template>
  <div>
    <h1>This is my discussion outline for {{page}}</h1>
    <p>
      <span v-html="pageText"></span>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DataService from '@/services/DataService.js'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME', 'pageFILENAME'],
  computed: mapState(['bookmark', 'imgDir']),
  data() {
    return {
      pageText: ''
    }
  },
  created() {
    console.log('I am in Page.Vue')
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    route.book = this.bookNAME
    route.page = this.pageFILENAME
    this.$store.dispatch('checkBookmark', route)
    console.log('sending to dataservice from Page.Vue')
    console.log(
      this.countryCODE +
        ',' +
        this.languageISO +
        ',' +
        this.bookmark.book.folder +
        ',' +
        this.pageFILENAME
    )
    DataService.getPage(
      this.countryCODE,
      this.languageISO,
      this.bookmark.book.folder,
      this.pageFILENAME
    )
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
