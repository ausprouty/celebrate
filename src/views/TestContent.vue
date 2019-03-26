/* eslint-disable no-fallthrough */
<template>
  <div>
    <NavBar/>
    <h1>{{this.test}} ---- {{this.version}}</h1>
    This page came from {{this.bookmark}}
    <br>
    <br>
    {{this.pageText}}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarBack.vue'
export default {
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),
  data() {
    return {
      pageText: '',
      source: ''
    }
  },

  created() {
    console.log('I am in Test.Vue')
    var route = {}
    route.test = 'countries'
   // route.test = 'languages'
   // route.test = 'library'
    //route.test = 'series'
    //route.test = 'page'
    route.version = 'latest'
    route.version = 'current'

    switch (route.test) {
      case 'page':
        route.page = 'basics106'
      // eslint-disable-next-line no-fallthrough
      case 'series':
        route.index = 'issues-chapters'
        route.folder = 'myfriends'
      // eslint-disable-next-line no-fallthrough
      case 'library':
        route.language = 'fra'
      // eslint-disable-next-line no-fallthrough
      case 'languages':
        route.country = 'AU'
      // eslint-disable-next-line no-fallthrough
      case 'countries':
    }
    this.test = route.test
    this.version = route.version
    this.$store.dispatch('checkBookmark', route).then(response => {
      this.getData(route)
    })
  },
  methods: {
    getData(route) {
      console.log('TEST - This is the route I sending to checkBookmark ')
      console.log(route)
      this.$store.dispatch('checkBookmark', route)
      console.log('TEST - sending to dataservice ')
      console.log(route)
      var ref = this
      switch (route.test) {
        case 'countries':
          console.log('TEST - countries')
          ContentService.getCountries(route).then(response => {
            console.log('TEST - response')
            console.log(response)
            ref.pageText = response
          })
          break
        case 'languages':
          console.log('TEST - languages')
          ContentService.getLanguages(route).then(response => {
            console.log('TEST - response')
            console.log(response)
            ref.pageText = response
          })
          break
        case 'library':
          console.log('TEST - library')
          ContentService.getLibrary(route).then(response => {
            console.log('TEST - response')
            console.log(response)
            ref.pageText = response
          })
          break
        case 'series':
          console.log('TEST - series')
          ContentService.getSeries(route).then(response => {
            console.log('TEST - response')
            console.log(response)
            ref.pageText = response
          })
          break
        case 'page':
          console.log('TEST - page')
          ContentService.getPage(route).then(response => {
            console.log('TEST - response')
            console.log(response)
            ref.pageText = response
          })
          break
        default:
          console.log('TEST - default')
          ref.pageText = 'There has been an error'
      } //switch
    } // getData
  } //methods
}
</script>
