<template>
  <div class="event-link" v-on:click="updateBookmark(chapter)">
    <div class="event-card -shadow">
      <div class="chapter">
        <div class="bold">{{chapter.title}}</div>
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
    },
    showVariables: function(chapter) {
      console.log('chapter')
      console.log(chapter)
    }
  },
  beforeMount() {
    this.showVariables(chapter)
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
