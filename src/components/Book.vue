<template>
  <div v-if="book.publish == 1">
    <div class="app-link" v-on:click="showPage(book)">
      <div class="app-card -shadow">
        <div v-if="!this.bookmark.language.titles">
        <img
          v-bind:src="appDir.library + this.image_dir + '/' + book.image"
          class="book"
        />
        <div class="book">
          <span class="bold">{{ book.title }}</span>
        </div>
      </div>
       <div v-if="this.bookmark.language.titles">
        <img
          v-bind:src="appDir.library + this.image_dir + '/' + book.image"
          class="something"
        />
      </div>
    </div>
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
            country_code: this.bookmark.country.code,
            language_iso: this.bookmark.language.iso,
            library_code: 'TODO',
            folder_name: this.book.name,
          }
        })
      } else {
        console.log('BOOK - this is a NOT a series')
        this.$router.push({
          name: 'page',
          params: {
            country_code: this.bookmark.country.code,
            language_iso: this.bookmark.language.iso,
            library_code: 'TODO',
            folder_name: this.book.name,
            filename: this.book.name
          }
        })
      }
    }
  }
}
</script>
<style>
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
