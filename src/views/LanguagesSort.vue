<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
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
    </div>
    <button class="button" @click="saveForm">Save</button>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { languageMixin } from '@/mixins/LanguageMixin.js'
export default {
  mixins: [bookMarkMixin, languageMixin],
  props: ['countryCODE'],
  components: {
    NavBar,
    draggable
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
        await ContentService.createContentData(this.content)
        this.$router.push({
          name: 'previewLanguages',
          params: {
            countryCODE: this.$route.params.countryCODE
          }
        })
      } catch (error) {
        console.log('LANGUAGES SORT There was an error ', error) //
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      await this.getLanguages()
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
