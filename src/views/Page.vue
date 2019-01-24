<template>
  <div>
    <link rel="stylesheet" v-bind:href="'/css/' + this.bookmark.book.style">
    <a href="/">
      <img
        v-bind:src="appDir.library + bookmark.language.image_dir + '/' + bookmark.book.image"
        class="app-img-header"
      >
    </a>
    <h1 v-if="bookmark.chapter.count">{{bookmark.chapter.count}}. {{bookmark.chapter.title}}</h1>
    <h1 v-else>{{bookmark.chapter.title}}</h1>
    <p>
      <span v-html="pageText"></span>
    </p>
    <div class="version">
      <p class="version">Version 1.01</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DataService from '@/services/DataService.js'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME', 'pageFILENAME'],
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
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
<style >
</style>
