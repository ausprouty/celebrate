<template>
  <div class="app-link" v-on:click="showPage(language)">
    <div class="app-card -shadow" v-bind:class="{notpublished : !language.publish}">
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
    showPage: function(language) {
      console.log('showPage')
      console.log(language)
      console.log(this.bookmark.country.code)
      localStorage.setItem('lastPage', 'language/' + language)
      this.$router.push({
        name: 'previewLibrary',
        params: {
          countryCODE: this.$route.params.countryCODE,
          languageISO: this.$route.params.languageISO,
          libraryCODE: this.$route.params.libraryCODE
        }
      })
    }
  }
}
</script>

<style scoped>
.app-card {
  padding: 10px;
  width: 100%;
  margin-bottom: 12px;
  transition: all 0.2s linear;
  cursor: pointer;
}
div.language {
  width: 100%;
  font-size: 18px;
}
.language {
  text-align: left;
}
.bold {
  font-weight: bold;
}
</style>
