<template>
  <div class="event-link" v-on:click="updateBookmark(chapter)">
    <div class="event-card -shadow">
      <img v-bind:src="imgDir.library + bookmark.language.images + '/' + chapter.image" class="chapter">
      <div class="chapter">
        <span class="bold">{{chapter.title}}</span>
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
          console.log('Library saved results with bookmark value')
          console.log(this.bookmark)
          this.$router.push({
            name: 'series',
            params: {
              folder: this.bookmark.language.folder,
              series: this.bookmark.chapter.chapter
            }
          })
        })
        .catch(() => {
          console.log('There was a problem storing language')
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
  width: 70%;
  font-size: 24px;
  float: right;
}
.chapter {
  text-align: left;
}
</style>
