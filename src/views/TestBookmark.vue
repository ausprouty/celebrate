/* eslint-disable no-fallthrough */
<template>
  <div>
    <NavBar/>
    <h1>{{this.test}} ---- {{this.version}}</h1>bookmark
    <br>
    {{this.result}}
    <br>
    <br>
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
      source: '',
      result: ''
    }
  },

  created() {
    console.log('I am in Test.Vue')
    var route = {}
    route.test = 'country'
    route.test = 'library'
    //route.test = 'series'
    //route.test = 'page'
    route.version = 'latest'
    //route.version = 'current'

    switch (route.test) {
      case 'page':
        route.fileFILENAME = 'basics106'
        route.folderNAME = 'myfriends'
      // eslint-disable-next-line no-fallthrough
      case 'series':
        route.fileFILENAME = 'issues-chapters'
        route.folderNAME = 'myfriends'
      // eslint-disable-next-line no-fallthrough

      // eslint-disable-next-line no-fallthrough
      case 'library':
        route.languageISO = 'eng'

      // eslint-disable-next-line no-fallthrough
      case 'country':
        route.countryCODE = 'AU'
    }
    this.test = route.test
    this.version = route.version
    var ref = this
    this.$store.dispatch('newBookmark')
    this.$store.dispatch('checkBookmark', route).then(response => {
      console.log('ref.bookmark')
      console.log(ref.bookmark)
      ref.result = ref.bookmark
    })
  }
}
</script>
