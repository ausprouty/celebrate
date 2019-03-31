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
export default {
  mixins: [bookMarkMixin],
  props: ['countryCODE'],
  components: {
    NavBar,
    draggable
  },
  computed: mapState(['bookmark', 'appDir']),
  data() {
    return {
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
      error: null,
      content: {
        recnum: '',
        version: '',
        edit_date: '',
        edit_uid: '',
        publish_uid: '',
        publish_date: '',
        language_iso: '',
        country_iso: '',
        folder: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      }
    }
  },
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
    saveForm() {
      console.log(this.content)
      this.content.text = JSON.stringify(this.languages)
      this.content.filename = 'languages'
      this.content.filetype = 'json'
      this.content.country_iso = this.$route.params.countryCODE
      var contentForm = ContentService.toFormData(this.content)
      var ref = this
      // clear bookmark because we are editing details
      this.$store.dispatch('newBookmark', 'clear')
      //
      ContentService.createContentData(contentForm).then(function(response) {
        if (response.data.error) {
          ref.errorMessage = response.data.message
        } else {
          // this.successMessage = response.data.message
          //ref.getCountries()
          ref.$router.push({
            name: 'previewLanguages',
            params: {
              countryCODE: ref.$route.params.countryCODE
            }
          })
        }
      })
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
    this.$store.dispatch('checkBookmark', this.$route.params)
  },
  created() {
    /* Update bookmark based on this route (for people to select URL from another source)
       Bookmark stores current Country and all specialized info for that country
      If there is only one language for this country we then go back to country
    */
    this.error = this.loaded = null
    this.loading = true
    this.languages = []
    console.log('Entered LanguageEdits.vue')
    console.log(this.$route.params.countryCODE)
    ContentService.getLanguages(this.$route.params)
      .then(response => {
        console.log('LANGUAGES SORT -  response data')
        console.log(response)
        if (response.content.text) {
          console.log('LANGUAGES SORT -  response.content.text exists')
          this.languages = JSON.parse(response.content.text)
        } else {
          this.languages = response.data
        }
        this.loaded = true
        this.loading = false
      })
      .catch(() => {
        console.log('There was a problem finding language')
      })
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
