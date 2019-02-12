<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <link rel="stylesheet" v-bind:href="'/css/' + this.bookmark.book.style">
      <div class="app-link">
        <div class="app-card -shadow">
          <img
            v-bind:src="appDir.library + this.bookmark.language.image_dir + '/' + this.bookmark.book.image"
            class="book"
          >

          <div class="book">
            <span class="bold">{{this.bookmark.book.title}}</span>
          </div>
        </div>
      </div>

      <h1 v-if="this.bookmark.page.count">{{this.bookmark.page.count}}. {{this.bookmark.page.title}}</h1>
      <h1 v-else>{{this.bookmark.page.title}}</h1>
      <p>
        <editor v-model="pageText" api-key="gxzi6f7gzgwnljd61r5piw87mdbhkehdocf238nb40ye85rt"></editor>
      </p>

    </div>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DataService from '@/services/DataService.js'
import NavBar from '@/components/NavBarBack.vue'
import Editor from '@tinymce/tinymce-vue'
//import tinymce from 'tinymce'
//import 'tinymce/themes/mobile/theme'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME', 'pageFILENAME'],
  components: {
    NavBar,
    editor: Editor // <- Important part
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      pageText: '',
      loadinG: false,
      loading: false,
      loaded: null,
      error: null,
      description: null
    }
  },

  created() {
    console.log('I am in Page.Vue')
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    route.book = this.bookNAME
    route.series = this.bookNAME
    route.page = this.pageFILENAME
    console.log('This is the route I sending to checkBookmark from Page.vue')
    console.log(route)
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
        //  console.log('page in Page.Vue')
        // console.log(response.data) // For now, logs out the response
        this.pageText = response.data
        this.loading = false
        this.loaded = true
      })
      .catch(error => {
        this.loading = false
        console.log('There was an error:', error.response) // Logs out the error
        this.error = error.toString()
      })
  }
}
</script>
<style >
</style>
