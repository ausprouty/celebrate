<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
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
import { libraryMixin } from '@/mixins/LibraryMixin.js'
export default {
  mixins: [bookMarkMixin, libraryMixin],
  components: {
    NavBar,
    draggable
  },
  props: ['countryCODE', 'languageISO'],
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
        this.content.text = JSON.stringify(this.library)
        this.content.filename = 'library'
        this.content.filetype = 'json'
        this.content.country_iso = this.$route.params.countryCODE
        this.content.language_iso = this.$route.params.languageISO
        this.$store.dispatch('newBookmark', 'clear')
        var contentForm = ContentService.toFormData(this.content)
        var response = await ContentService.createContentData(contentForm)
        this.$router.push({
          name: 'previewLibrary',
          params: {
            countryCODE: this.$route.params.countryCODE,
            languageISO: this.$route.params.languageISO
          }
        })
      } catch (error) {
        console.log('LIBRARY EDIT There was an error ', error) //
      }
    },
    beforeCreate() {
      this.$route.params.version = 'latest'
    },
    async created() {
      try {
        this.getLibrary()
      } catch (error) {
        console.log('There was an error in LibraryEdit.vue:', error) // Logs out the error
      }
    }
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
