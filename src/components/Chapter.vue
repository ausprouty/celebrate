<template>
  <div class="event-link" v-on:click="updateBookmark(chapter)">
    <div class="event-card -shadow">
      <div class="chapter">
        <div class="bold">{{chapter.title}} aa</div>
        <div class="bold">{{chapter.description}}</div>
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
  computed: mapState(['bookmark', 'imgDir']),
  methods: {
    updateBookmark: function(chapter) {
      this.$store
        .dispatch('updateBookmark', ['chapter', chapter])
        .then(() => {
          console.log('Chapter saved results with bookmark value')
          console.log(this.bookmark)
          this.$router.push({
            name: 'page',
            params: {
              country: this.bookmark.country.iso,
              language: this.bookmark.language.folder,
              series: this.bookmark.chapter.chapter,
              page: this.chapter.filename
            }
          })
        })
        .catch(() => {
          console.log('There was a problem storing chapter')
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
</style>
