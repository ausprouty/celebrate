<template>
  <div>
    <NavBar />

    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">
      There was an error... {{ this.error_message }}
    </div>
    <div class="content" v-if="loaded">
      <div v-if="!this.authorized">
        <p>
          You have stumbled into a restricted page. Sorry I can not show it to
          you now
        </p>
      </div>
      <div v-if="this.authorized">
        <h1>Series for {{ this.$route.params.countryCODE }}</h1>
        <div class="form">
          <span>Series Description:</span>
          <br />
          <textarea
            v-model="seriesDetails.description"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <div>
          <button class="button" @click="addNewChapterForm">New Chapter</button>
          <draggable v-model="chapters">
            <transition-group>
              <div
                v-for="chapter in chapters"
                :key="chapter.id"
                :book="chapter"
              >
                <div class="shadow-card -shadow">
                  <img
                    v-bind:src="appDir.icons + 'move2red.png'"
                    class="sortable"
                  />
                  <span class="card-name">{{ chapter.title }}</span>
                </div>
              </div>
            </transition-group>
          </draggable>
        </div>
        <button class="button" @click="saveForm">Save</button>
        <br />
        <br />
        <br />
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
import { mapState } from 'vuex'

import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import draggable from 'vuedraggable'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { seriesMixin } from '@/mixins/SeriesMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, seriesMixin, authorMixin],
  props: ['countryCODE', 'languageISO', 'libraryCODE', 'folderNAME'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    NavBar,
    draggable
  },
  data() {
    return {
      authorized: false
    }
  },
  methods: {
    addNewChapterForm() {
      this.chapters.push({
        id: '',
        title: '',
        description: '',
        count: '',
        filename: ''
      })
    },
    deleteChapterForm(id) {
      this.chapters.splice(id, 1)
    },
    async saveForm() {
      try {
        console.log(this.content)
        var text = {}
        text.description = this.seriesDetails.description
        text.chapters = this.chapters
        var valid = ContentService.validate(text)
        this.content.text = JSON.stringify(valid)
        this.content.country_code = this.$route.params.countryCODE
        this.content.language_iso = this.$route.params.languageISO
        this.content.folder = this.$route.params.folderNAME
        this.content.filename = 'index'
        this.content.filetype = 'json'
        this.$store.dispatch('newBookmark', 'clear')
        var response = await AuthorService.createContentData(this.content)
        if (response.data.error != true) {
          this.$router.push({
            name: 'previewSeries',
            params: {
              countryCODE: this.$route.params.countryCODE,
              languageISO: this.$route.params.languageISO,
              libraryCODE: this.$route.params.libraryCODE,
              folderNAME: this.$route.params.folderNAME
            }
          })
        } else {
          this.error = true
          this.loaded = false
          this.error_message = response.data.message
        }
      } catch (error) {
        console.log('LIBRARY EDIT There was an error ', error)
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      this.getSeries(this.$route.params)
      this.authorized = this.authorize('write', this.$route.params.countryCODE)
    } catch (error) {
      console.log('There was an error in SeriesEdit.vue:', error) // Logs out the error
    }
  }
}
</script>

<style scoped>
.float-right {
  text-align: right;
}
</style>
