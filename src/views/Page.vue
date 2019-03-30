<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <link rel="stylesheet" v-bind:href="'/css/' + this.style">
      <div class="app-link">
        <div class="app-card -shadow">
          <img v-bind:src="this.book_image" class="book">

          <div class="book">
            <span class="bold">{{this.bookmark.book.title}}</span>
          </div>
        </div>
      </div>

      <h1 v-if="this.bookmark.page.count">{{this.bookmark.page.count}}. {{this.bookmark.page.title}}</h1>
      <h1 v-else>{{this.bookmark.page.title}}</h1>
      <p>
        <span v-html="pageText"></span>
      </p>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
//import BookmarkService from '@/services/BookmarkService.vue'
import { versionLatestMixin } from '@/mixins/VersionLatestMixin.js'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import NavBar from '@/components/NavBarBack.vue'
export default {
  mixins: [versionLatestMixin, bookMarkMixin],
  props: ['countryCODE', 'languageISO', 'folderNAME', 'fileFILENAME'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  data() {
    return {
      pageText: '',
      loading: false,
      loaded: null,
      error: null,
      image_dir: null,
      image: null,
      book_image: null,
      style: null
    }
  },
  
  async created() {
    try {
      let ref = this
      this.$route.params.version = 'current'
      this.$route.params.page = this.$route.params.fileFILENAME

    //  await this.CheckBookmarkCountry(this.$route.params)
    //  await this.CheckBookmarkLanguageLibrary(this.$route.params)
    //  await this.CheckBookmarkSeries(this.$route.params)
    //  await this.CheckBookmarkBook(this.$route.params)
    //  await this.CheckBookmarkPage(this.$route.params)
      console.log(this.bookmark)
      console.log('BOOKMARK SERVICE --    FINISHED BOOKMARK')
      localStorage.setItem('bookmark', JSON.stringify(this.state.bookmark))
      // Logs out the
      //var bm = await this.$store.dispatch('checkBookmark', this.$route)
      console.log(bm)
      console.log('PAGE VUE created has started')
      this.error = this.loaded = null
      this.loading = true
      console.log('this.standard')
      console.log(this.standard)
      this.image_dir = this.standard.image_dir
      if (this.bookmark.language) {
        this.image_dir = this.bookmark.language.image_dir
      }
      this.image = this.standard.image
      this.style = this.standard.style
      if (this.bookmark.book) {
        this.image = this.bookmark.book.image
        this.style = this.bookmark.book.style
      }
      this.book_image = this.appDir.library + this.image_dir + '/' + this.image

      var response = await ContentService.getPage(this.$route.params)
      console.log('PAGE VUE - response.data')
      console.log(response.data)
      ref.pageText = response.data
      ref.loading = false
      ref.loaded = true
    } catch (error) {
      this.loading = false
      console.log('PAGE VUE - There was an error:', error) // Logs out the error
      this.error = error.toString()
    }
  }
}
</script>
<style >
</style>
