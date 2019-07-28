<template>
  <div class="preview">
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{ this.error }}</div>
    <div class="content" v-if="loaded">
      <div v-if="this.publish">
        <button class="button" @click="local_publish()">Publish</button>
      </div>
       <div v-if="this.prototype">
        <button class="button" @click="local_prototype()">Prototype</button>
      </div>
      <link rel="stylesheet" v-bind:href="'/content/' + this.$route.params.css">
        <hr class="border">
        <span v-html="pageText"></span>
      </br>
       <span v-html="footerText"></span>
      <div class="version">
        <p class="language">Version 1.01</p>
      </div>
    </div>
    <hr class="border">
    <div v-if="write">
      <button class="button" @click="editPage">Edit</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import PrototypeService from '@/services/PrototypeService.js'
import PublishService from '@/services/PublishService.js'
import NavBar from '@/components/NavBarCountry.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { freeformMixin } from '@/mixins/FreeformMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, freeformMixin, authorMixin],
  props: ['country_code', 'language_iso', 'folder_name', 'filename'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL']),

  methods: {
    editPage() {

      this.$router.push({
        name: 'editCountryPage',
        params: {
          country_code: this.$route.params.country_code
        }
      })
    },
    goBack() {
        this.$router.push({
          name: 'previewCountries'
        })  
    },
    async local_publish(location) {
      var params = {}
      var response = null
      params.recnum = this.recnum
      params.bookmark = JSON.stringify(this.bookmark)
      params.route = JSON.stringify(this.$route.params)
      if (location == 'prototype') {
        response = await PrototypeService.publish('country', params)
      } else {
        response = await PublishService.publish('country', params)
      }
      if (typeof response['error'] != 'undefined'){
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
        await this.getCountry()
        this.write = this.authorize('write', 'world')
         // authorize for prototype and publish
        this.publish = false
        this.prototype = false
        if (this.recnum && !this.prototype_date) {
          this.prototype = this.authorize(
            'publish',
            this.$route.params.country_code
          )
          if (this.prototype){
            this.prototype_text = 'Prototype'
          }
        }
        if (this.recnum && !this.publish_date && this.prototype_date) {
          this.publish = this.authorize(
            'publish',
            this.$route.params.country_code
          )
          if (this.publish){
            this.prototype = true
            this.prototype_text = 'Prototype Again'
          }
        }
        // end authorization for prototype and publish

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
