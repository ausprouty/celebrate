<template>
  <div class="app-link" v-on:click="showPage(chapter)">
    <div
      class="app-card -shadow"
      v-bind:class="{ notpublished: !chapter.publish }"
    >
      <div v-if="!this.chapter.image">
        <div class="chapter">
          <div v-if="chapter.count" class="chapter-title">
            {{ chapter.count }}. {{ chapter.title }}
          </div>
          <div v-else class="chapter-title">{{ chapter.title }}</div>
          <div class="chapter-description">{{ chapter.description }}</div>
        </div>
      </div>
      <div v-if="this.chapter.image">
        <img
          v-bind:src="appDir.library + this.image_dir + '/' + chapter.image"
          class="something"
        />
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
  data() {
    return {
      image_dir: ''
    }
  },
  computed: mapState(['bookmark', 'appDir']),
  methods: {
    showPage: function(chapter) {
      localStorage.setItem('lastPage', 'language/' + this.chapter.filename)
      this.$router.push({
        name: 'previewPage',
        params: {
          countryCODE: this.$route.params.countryCODE,
          languageISO: this.$route.params.languageISO,
          libraryCODE: this.$route.params.libraryCODE,
          folderNAME: this.bookmark.book.name,
          fileNAME: chapter.filename
        }
      })
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
