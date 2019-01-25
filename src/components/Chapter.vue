<template>
  <div class="app-link" v-on:click="showPage(chapter)">
    <div class="app-card -shadow">
      <div class="chapter">
        <div v-if = chapter.count class="chapter-title">{{chapter.count}}. {{chapter.title}}</div>
         <div v-else class="chapter-title">{{chapter.title}}</div>
        <div class="chapter-description">{{chapter.description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    chapter: Object
  },
  computed: mapState(['bookmark', 'appDir']),
  methods: {
    showPage: function(chapter) {
      localStorage.setItem('lastPage', 'language/' + this.chapter.filename)
      var params = {
        countryCODE: this.bookmark.country.code,
        languageISO: this.bookmark.language.iso,
        bookNAME: this.bookmark.book.book,
        pageFILENAME: this.chapter.filename
      }
      console.log(params)
      this.$router.push({
        name: 'page',
        params
      })
    }
  }
}
</script>
<style scoped>
img.chapter {
  width: 25%;
}
div.chapter {
  vertical-align: top;
  width: 90%;
  font-size: 16px;
}
.chapter {
  text-align: left;
}
div.chapter-title {
  font-size: 16 pt;
  font-weight: bold;
  color: black;
}
div.chapter-description {
  font-size: 12 pt;
  font-weight: normal;
  margin-right: 10 px;
  color: gray;
}
</style>
