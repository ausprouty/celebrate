<template>
  <div class="app-link" v-on:click="showPage(book)">
    <div
      class="app-card -shadow"
      v-bind:class="{ notpublished: !book.publish }"
    >
      <div v-if="!this.bookmark.language.titles">
        <img v-bind:src="book.image.image" class="book" />
        <div class="book" v-bind:class="this.bookmark.language.rldir">
          <span class="title" v-bind:class="this.bookmark.language.rldir">{{
            book.title
          }}</span>
        </div>
      </div>
      <div v-if="this.bookmark.language.titles">
        <img v-bind:src="book.image.image" class="something" />
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
      image_dir: '',
      rldir: 'ltr'
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
      // dealing with legacy data
      var code = ''
      if (typeof book.code !== 'undefined') {
        code = book.code
      } else {
        code = book.name
      }
      if (book.format == 'series') {
        console.log('BOOK  PREVIEW - this is a series')
        console.log(book)
        this.$router.push({
          name: 'previewSeries',
          params: {
            country_code: this.$route.params.country_code,
            language_iso: this.$route.params.language_iso,
            library_code: this.$route.params.library_code,
            folder_name: code
          }
        })
      } else {
        console.log('BOOK  PREVIEW - this is a NOT a series')
        var my_params = {
          country_code: this.$route.params.country_code,
          language_iso: this.$route.params.language_iso,
          library_code: this.$route.params.library_code,
          folder_name: 'pages',
          filename: code
        }
        console.log(my_params)
        this.$router.push({
          name: 'previewPage',
          params: my_params
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
div.book.rtl {
  width: 30%;
  text-align: left;
}
.book {
  text-align: left;
}
.rtl {
  text-align: right;
  direction: rtl;
}
</style>
