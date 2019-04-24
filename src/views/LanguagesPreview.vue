<template>
  <div class="preview">
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <a href="preview/languages">
        <img v-bind:src="appDir.root+'languages.jpg'" class="app-img-header">
      </a>

      <h1>Choose Language (preview for {{this.countryCODE}})</h1>
      <Language v-for="language in languages" :key="language.iso" :language="language"/>
      <div v-if="!this.ZZ">
        <a href="/languages/ZZ">More Languages</a>
      </div>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
      <div v-if="this.write">
        <button class="button" @click="editLanguages">Edit</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button
          class="button"
          @click="sortLanguages"
        >Sort</button>
      </div>
      <div v-if="this.readonly">
        <button class="button" @click="editLanguages">View Details</button>
      </div>
    </div>
  </div>
</template>

<script>
import Language from '@/components/LanguagePreview.vue'
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { languageMixin } from '@/mixins/LanguageMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, languageMixin, authorMixin],
  props: ['countryCODE'],
  components: {
    Language,
    NavBar
  },
  data() {
    return {
      readonly: false,
      write: false
    }
  },
  computed: mapState(['bookmark', 'appDir']),
  methods: {
    editLanguages() {
      this.$router.push({
        name: 'editLanguages',
        params: {
          countryCODE: this.countryCODE
        }
      })
    },
    sortLanguages() {
      this.$router.push({
        name: 'sortLanguages',
        params: {
          countryCODE: this.countryCODE
        }
      })
    },
    goBack() {
      window.history.back()
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      await this.getLanguages()
      this.readonly = this.authorize('readonly')
      this.write = this.authorize('write')
      this.ZZ = false
      if (this.$route.params.countryCODE == 'ZZ') {
        this.ZZ = true
      }
      this.loaded = true
      this.loading = false
    } catch (error) {
      console.log('There was an error in LanguagesEdit.vue:', error) // Logs out the error
    }
  }
}
</script>


<style>
</style>
