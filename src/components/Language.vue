<template>
  <div class="event-link" v-on:click="updateBookmark(language)">
    <div class="event-card -shadow">
      <div class="language">
        <span class="bold">{{language.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    language: Object
  },
  computed: mapState(['bookmark']),
  methods: {
    updateBookmark: function(language) {
      console.log('update Bookmark with')
      console.log(language)
      this.$store
        .dispatch('updateBookmark', ['language', language])
        .then(() => {
          this.$router.push({
            name: 'library',
            params: {
              country: this.bookmark.country.code,
              language: this.bookmark.language.folder
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
div.language {
  width: 100%;
  font-size: 24px;
}
.language {
  text-align: left;
}

.bold {
  font-weight: bold;
}
</style>
