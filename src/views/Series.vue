<template>
  <div>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <link rel="stylesheet" v-bind:href="'/css/' + this.bookmark.book.style">
      <div class="app-link" v-on:click="goBack()">
        <div class="app-card -shadow">
          <img
            v-bind:src="appDir.library + bookmark.language.image_dir + '/' + bookmark.book.image"
            class="app-img-header"
          >
          <img v-bind:src="appDir.root+'backbar.png'" class="app-img-header">
        </div>
      </div>
      <h1>{{bookmark.book.title}}</h1>
      <div v-if="this.bookmark.series.description">{{this.bookmark.series.description}}</div>

      <Chapter
        v-for="chapter in this.bookmark.series.chapters"
        :key="chapter.id"
        :chapter="chapter"
      />
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/Chapter.vue'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    Chapter
  },
  data() {
    return {
      loading: false,
      loaded: null,
      error: null
    }
  },
  methods: {
    goBack() {
      window.history.back()
    }
  },
  created() {
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    route.book = this.bookNAME // we need book to get style sheet
    route.series = this.bookNAME
    this.$store.dispatch('checkBookmark', route).then(response => {
      this.loading = false
      this.loaded = true
      console.log('response from checkBookmark in Series.vue')
      console.log(response)
    })
    // .catch(error => {
    //  this.loading = false
    //   console.log('There was an error in  bookmark Library:', error.response) // Logs out the error
    //  this.error = error.toString()

    //  })
  }
}
</script>
