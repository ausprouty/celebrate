<template>
  <div>
    <NavBar />
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{ this.error }}</div>
    <div class="content" v-if="loaded">
      <link
        rel="stylesheet"
        v-bind:href="'/content/' + this.bookmark.book.style"
      />
      <div class="app-link">
        <div class="app-card -shadow">
          <div v-on:click="goBack()">
            <img v-bind:src="this.book_image" class="book" />
            <div class="book">
              <span class="bold">{{ this.bookmark.book.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <h1 v-if="this.bookmark.page.count">
        {{ this.bookmark.page.count }}. {{ this.bookmark.page.title }}
      </h1>
      <h1 v-else>{{ this.bookmark.page.title }}</h1>
      <p>
        <span v-html="pageText"></span>
      </p>
      <div class="version">
        <p class="version">Version 1.01</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarBack.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { pageMixin } from '@/mixins/PageMixin.js'
export default {
  mixins: [bookMarkMixin, pageMixin],
  props: ['country_code', 'language_iso', 'folder_name', 'filename'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  data() {
    return {
      image_dir: null,
      image: null,
      book_image: null,
      style: null
    }
  },
  methods: {
    goBack() {
      window.history.back()
    }
  },
  beforeCreate() {
    this.$route.params.version = 'current'
  },
  async created() {
    try {
      console.log('PAGE VIEW - route')
      console.log(this.$route.params)
      this.getPage(this.$route.params)
    } catch (error) {
      console.log('There was AN error in Page.vue:', error) // Logs out the error
    }
  }
}
</script>
<style></style>
