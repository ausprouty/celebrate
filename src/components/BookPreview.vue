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
    if (typeof this.bookmark.language != 'undefined') {
      console.log('BOOK  PREVIEW -using bookmark')
      this.image_dir = this.bookmark.language.image_dir
    } else {
      console.log('BOOK  PREVIEW -using standard directory')
      this.image_dir = this.standard.image_dir
    }
  },
  methods: {
    showPage: function(book) {
      console.log('BOOK  PREVIEW - book')
      console.log(book)
      localStorage.setItem('lastPage', 'library/country/language')
      if (book.format == 'series') {
        console.log('BOOK  PREVIEW - this is a series')
        this.$router.push({
          name: 'previewSeries',
          params: {
            countryCODE: this.bookmark.country.code,
            languageISO: this.bookmark.language.iso,
            seriesNAME: this.book.book
          }
        })
      } else {
        console.log('BOOK  PREVIEW - this is a NOT a series')
        this.$router.push({
          name: 'previewPage',
          params: {
            countryCODE: this.bookmark.country.code,
            languageISO: this.bookmark.language.iso,
            folderNAME: this.book.folder,
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
  font-size: 18px;
  float: right;
}
.book {
  text-align: left;
}
</style>
