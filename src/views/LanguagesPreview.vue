<template>
  <div class="preview">
    <NavBar/>
    <div class="loading" v-if="loadinG">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <img v-bind:src="appDir.root+'languages.jpg'" class="app-img-header">

      <h1>Choose Language (preview for {{this.countryCODE}})</h1>
      <Language v-for="language in languages" :key="language.iso" :language="language"/>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
    <button class="button" @click="editLanguages">Edit</button>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button class="button" @click="sortLanguages">Sort</button>
  </div>
</template>

<script>
import Language from '@/components/LanguagePreview.vue'
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { languageMixin } from '@/mixins/LanguageMixin.js'
export default {
  mixins: [bookMarkMixin, languageMixin],
  props: ['countryCODE'],
  components: {
    Language,
    NavBar
  },
  computed: mapState(['bookmark', 'appDir']),
  data() {
    return {
      loadinG: false,
      language: [],
      languages: [
        {
          id: '',
          folder: '',
          iso: '',
          name: '',
          image_dir: '',
          rldir: 'ltr'
        }
      ],
      loading: false,
      loaded: null,
      error: null
    }
  },
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
      this.getLanguages()
    } catch (error) {
      console.log('There was an error in LanguagesEdit.vue:', error) // Logs out the error
    }
  }
}
</script>


<style>
</style>
