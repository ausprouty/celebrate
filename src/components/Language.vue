<template>
  <div class="app-link" v-on:click="showPage(language)">
    <div class="app-card -shadow">
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
      localStorage.setItem('lastPage', 'language/' + language)
      this.$router.push({
        name: 'library',
        params: {
          countryCODE: this.bookmark.country.code,
          languageISO: language.iso
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
