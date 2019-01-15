<template>
  <div class="event-link" v-on:click="updateBookmark(book)">
    <div class="event-card -shadow">
      <img v-bind:src="imgDir.library + bookmark.language.images + '/' + book.image" class="book">
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
  computed: mapState(['bookmark', 'imgDir']),
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
                country:this.bookmark.country.iso,
                folder: this.bookmark.language.folder,
                series: this.bookmark.book.book
              }
            })
          } else {
            this.$router.push({
              name: 'page',
              params: {
                folder: this.bookmark.language.folder,
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
<style scoped>
img.book {
  width: 25%;
}
div.book {
  vertical-align: top;
  width: 70%;
  font-size: 24px;
  float: right;
}
.book {
  text-align: left;
}
</style>
