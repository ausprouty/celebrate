<template>
  <div class="app-link" v-on:click="showPage(book)">
    <div class="app-card -shadow">
      <img v-bind:src="appDir.library  + this.image_dir  + '/' +book.image" class="book">
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
  computed: mapState(['bookmark', 'standard', 'appDir']),
  data() {
    return {
      image_dir: ''
    }
  },
  created() {
    this.image_dir = this.standard.image_dir
    if (typeof this.bookmark.language.image_dir != 'undefined') {
      console.log('USING BOOKMARK')
      this.image_dir = this.bookmark.language.image_dir
    }
  },
  methods: {
    showPage: function(book) {
      console.log('book')
      console.log(book)
      localStorage.setItem('lastPage', 'library/country/language')
      if (book.format == 'series') {
        console.log('BOOK - this is a series')
        this.$router.push({
          name: 'series',
          params: {
            countryCODE: this.bookmark.country.code,
            languageISO: this.bookmark.language.iso,
            bookNAME: this.book.book
          }
        })
      } else {
        console.log('BOOK - this is a NOT a series')
        this.$router.push({
          name: 'page',
          params: {
            countryCODE: this.bookmark.country.code,
            languageISO: this.bookmark.language.iso,
            bookNAME: this.book.book,
            fileFILENAME: this.book.book
          }
        })
      }
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
  font-size: 24px;
  float: right;
}
.book {
  text-align: left;
}
</style>
