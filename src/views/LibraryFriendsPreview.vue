<template>
  <div class="preview">
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{ this.error }}</div>
    <div class="content" v-if="loaded">
      <div v-if="this.publish">
        <button class="button" @click="local_publish()">Publish</button>
      </div>
      <link rel="stylesheet" v-bind:href="'/content/' + this.$route.params.css">
       <hr class="border">
        <span v-html="pageText"></span>
      </p>
        <div class="version">
        <p class="language">Version 1.01</p>
      </div>
       <hr class="border">
    </div>
    <div v-if="write">
      <button class="button" @click="editPage">Edit</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import PublishService from '@/services/PublishService.js'
import NavBar from '@/components/NavBarFreeform.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { freeformMixin } from '@/mixins/FreeformMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, freeformMixin, authorMixin],
  props: ['countryCODE', 'languageISO', 'bookNAME', 'fileFILENAME'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),

  methods: {
    editPage() {

      this.$router.push({
        name: 'editLibraryFriends',
        params: {
          countryCODE: this.$route.params.countryCODE
        }
      })
    },
    goBack() {
        this.$router.push({
          name: 'previewCountries'
        })  
    },
    async local_publish() {
      var params = {}
      params.recnum = this.recnum
      params.fileFILENAME = 'libraryF'
      params.countryCODE = this.$route.params.countryCODE
      var response = await PublishService.publish('freeform', params)
      if (response['error']) {
        this.error = response['message']
        this.loaded = false
      } else {
        this.UnsetBookmarks()
        this.recnum = null
        this.loaded = false
        this.loading = true
        this.publish = false
        await this.loadView()
      }
    },
    async loadView() {
      try {
        this.$route.params.css = 'AU/styles/AU-freeform.css'
        this.$route.params.fileFILENAME = 'libraryF'
        await this.getLibraryPage()
        this.authorized = this.authorize('write', this.$route.params.countryCODE)
        this.readonly = this.authorize(
          'readonly',
          this.$route.params.countryCODE
        )
        this.write = this.authorize('write', this.$route.params.countryCODE)
        this.publish = false
        if (this.recnum && !this.publish_date) {
          this.publish = this.authorize(
            'publish',
            this.$route.params.countryCODE
          )
        }
      } catch (error) {
        console.log('There was an error in Country.vue:', error)
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    this.loadView()
  }
}
</script>
