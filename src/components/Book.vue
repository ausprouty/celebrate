<template>
  <div class="app-link" v-on:click="updateBookmark(book)">
    <div class="app-card -shadow">
      <img
        v-bind:src="appDir.library + bookmark.language.image_dir + '/' + book.image"
        class="book"
      >
      <div class="book">
        <span class="bold">{{book.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    book: Object
  },
  computed: mapState(['bookmark', 'appDir']),
  methods: {
    updateBookmark: function(book) {
      this.$store
        .dispatch('updateBookmark', ['book', book])
        .then(() => {
          console.log('Library saved results with bookmark value')
          console.log(this.bookmark)
          if (this.bookmark.book.format == 'series') {
            this.$router.push({
              name: 'series',
              params: {
                countryCODE: this.bookmark.country.code,
                languageISO: this.bookmark.language.iso,
                bookNAME: this.bookmark.book.book
              }
            })
          } else {
            this.$router.push({
              name: 'page',
              params: {
                folder: this.bookmark.language.iso,
                series: this.bookmark.book.book
              }
            })
          }
        })
        .catch(() => {
          console.log('There was a problem storing language')
        })
    }
  }
}
</script>
<style >
img.book {
  width: 25%;
}
div.book {
  vertical-align: top;
  width: 70%;
  font-size: 18px;
  float: right;
}
.book {
  text-align: left;
}
</style>
