<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{this.error_message}}</div>
    <div class="content" v-if="loaded">
      <div v-if="!this.authorized">
        <p>You have stumbled into a restricted page. Sorry I can not show it to you now</p>
      </div>
      <div v-if="this.authorized">
        <h1>Languages for {{this.$route.params.countryCODE}}</h1>
        <div>
          <draggable v-model="languages">
            <transition-group>
              <div v-for="language in languages" :key="language.id" :language="language">
                <div class="shadow-card -shadow">
                  <img v-bind:src="appDir.icons +'move2red.png' " class="sortable">
                  <span class="card-name">{{language.name}}</span>
                </div>
              </div>
            </transition-group>
          </draggable>
        </div>
        <button class="button" @click="saveForm">Save</button>
      </div>
      <div v-if="!this.authorized">
        <p>
          You need to
          <a href="/login">login to make changes</a> here
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { languageMixin } from '@/mixins/LanguageMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, languageMixin, authorMixin],
  props: ['countryCODE'],
  components: {
    NavBar,
    draggable
  },
  data() {
    return {
      authorized: false
    }
  },
  computed: mapState(['bookmark', 'appDir']),

  methods: {
    addNewLanguageForm() {
      this.languages.push({
        id: '',
        folder: '',
        iso: '',
        name: '',
        image_dir: '',
        rldir: 'ltr'
      })
    },
    deleteLanguageForm(index) {
      this.languages.splice(index, 1)
    },
    async saveForm() {
      try {
        this.$store.dispatch('newBookmark', 'clear')
        var valid = ContentService.validate(this.library)
        this.content.text = JSON.stringify(valid)
        this.content.filename = 'languages'
        this.content.filetype = 'json'
        this.content.country_iso = this.$route.params.countryCODE
        valid = await AuthorService.createContentData(this.content)
        this.$router.push({
          name: 'previewLanguages',
          params: {
            countryCODE: this.$route.params.countryCODE
          }
        })
      } catch (error) {
        console.log('LANGUAGES SORT There was an error ', error) 
        this.error = true
        this.loaded = false
        this.error_message = valid.data.message
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      await this.getLanguages()
      this.authorized = this.authorize('write')
      this.loaded = true
      this.loading = false
    } catch (error) {
      console.log('There was an error in LanguagesEdit.vue:', error) // Logs out the error
    }
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
