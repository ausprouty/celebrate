<template>
  <div>
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
    <div v-if="this.series.description">{{this.series.description}}</div>

    <Chapter v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"/>
    <div class="version">
      <p class="version">Version 1.01</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/Chapter.vue'
import BookmarkService from '@/services/Bookmark.js'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME'],
  computed: mapState(['appDir']),
  components: {
    Chapter
  },
  data() {
    return {
      series: [],
      chapters: []
    }
  },
  methods: {
    goBack() {
      window.history.back()
    }
  },
  created() {
    var route = {}
    route.country = this.countryCODE
    route.language = this.languageISO
    route.book = this.bookNAME // we need book to get style sheet
    route.series = this.bookNAME
    BookmarkService(route)
      .then(myBookmark => {
        console.log('response in Series Vu from dispatch')
        console.log(myBookmark)
        this.series = myBookmark.series
        this.chapters = this.series.chapters
        console.log('chapters in Series.Vue')
        console.log(this.chapters)
      })
      .catch(error => {
        console.log('There was an error:', error.response) // Logs out the error
      })
  }
}
</script>
