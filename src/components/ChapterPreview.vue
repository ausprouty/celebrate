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
          v-bind:src="
            appDir.library + this.series_image_dir + '/' + chapter.image
          "
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
      console.log ('chapter')
      console.log (chapter)
      localStorage.setItem('lastPage', 'language/' + this.chapter.filename)
      var folder_name = ''
      // this section needed for legacy code
      if (typeof this.bookmark.book.name !== 'undefined') {
        folder_name = this.bookmark.book.name
      }
      if (typeof this.bookmark.book.code !== 'undefined') {
        folder_name = this.bookmark.book.code
      }
      var my_params = {
        country_code: this.$route.params.country_code,
        language_iso: this.$route.params.language_iso,
        library_code: this.$route.params.library_code,
        folder_name: folder_name,
        filename: chapter.filename
      }
      console.log('my_params')
      console.log(my_params)
      this.$router.push({
        name: 'previewPage',
        params: my_params
      })
    }
  },
  created() {
    this.series_image_dir =
      this.$route.params.country_code +
      '/' +
      this.$route.params.language_iso +
      '/' +
      this.$route.params.folder_name
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
  font-size: 16pt;
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
