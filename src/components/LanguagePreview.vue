<template>
  <div class="app-link" v-on:click="showPage(language)">
    <div
      class="app-card -shadow"
      v-bind:class="{
        notpublished: !language.publish,
        custom: language.custom
      }"
    >
      <div class="language">
        <span class="bold">{{ language.name }}</span>
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
      var route = 'previewLibrary'
      if (language.custom) {
        route = 'previewLibraryIndex'
      }
      this.$router.push({
        name: route,
        params: {
          country_code: this.$route.params.country_code,
          language_iso: language.iso
        }
      })
    }
  }
}
</script>

<style scoped>
.custom {
  background-color: green;
}
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
