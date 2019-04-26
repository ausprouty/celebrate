<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{this.error}}</div>
    <div class="content" v-if="loaded">
      <div v-if="!this.authorized">
        <p>You have stumbled into a restricted page. Sorry I can not show it to you now</p>
      </div>
      <div v-if="this.authorized">
        <h1>Library</h1>
        <div>
          <draggable v-model="library">
            <transition-group>
              <div v-for="book in library" :key="book.id" :book="book">
                <div class="shadow-card -shadow">
                  <img v-bind:src="appDir.icons +'move2red.png' " class="sortable">
                  <span class="card-name">{{book.title}}</span>
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
import { libraryMixin } from '@/mixins/LibraryMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, libraryMixin, authorMixin],
  components: {
    NavBar,
    draggable
  },
  props: ['countryCODE', 'languageISO'],
  data() {
    return {
      authorized: false
    }
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  methods: {
    addNewBookForm() {
      this.library.push({
        id: '',
        book: '',
        title: '',
        folder: '',
        index: '',
        style: 'AU-myfriends.css',
        image: 'issues.jpg',
        format: 'series'
      })
    },
    deleteBookForm(index) {
      this.library.splice(index, 1)
    },
    async saveForm() {
      try {
        var valid = ContentService.validate(this.library)
        this.content.text = JSON.stringify(valid)
        this.content.filename = 'library'
        this.content.filetype = 'json'
        this.content.country_code = this.$route.params.countryCODE
        this.content.language_iso = this.$route.params.languageISO
        this.$store.dispatch('newBookmark', 'clear')
        valid = await AuthorService.createContentData(this.content)
        this.$router.push({
          name: 'previewLibrary',
          params: {
            countryCODE: this.$route.params.countryCODE,
            languageISO: this.$route.params.languageISO
          }
        })
      } catch (error) {
        console.log('LIBRARY EDIT There was an error ', error)
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
      await this.getLibrary()
      this.authorized = this.authorize('write', this.$route.params.countryCODE)
      this.loaded = true
      this.loading = false
    } catch (error) {
      console.log('There was an error in LibraryEdit.vue:', error) // Logs out the error
    }
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
