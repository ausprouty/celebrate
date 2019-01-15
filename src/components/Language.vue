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
      this.$store
        .dispatch('updateBookmark', ['language', language])
        .then(() => {
          console.log('results saved with bookmark value')
          console.log(this.bookmark)
          console.log('that was value')
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
.event-card {
  padding: 10px;
  width: 100%;
  margin-bottom: 12px;
  transition: all 0.2s linear;
  cursor: pointer;
}
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
