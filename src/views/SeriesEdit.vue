<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Series for {{this.$route.params.countryCODE}}</h1>
      <div class="form">
        <span>Series Description:</span>
        <br>
        <textarea v-model="description" placeholder="add multiple lines"></textarea>
      </div>
      <div>
        <button class="button" @click="addNewChapterForm">New Chapter</button>
        <button class="button" @click="saveForm">Save</button>
        <div v-for="(chapter, index) in chapters" :key="chapter.id" :chapter="chapter">
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteChapterForm(index)">X</div>
            <h4 class="card-title">Chapter #{{chapter.id}}</h4>
            <div class="form">
              <span>Title:</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Title"
                v-model="chapter.title"
              >
              <span>Description:</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Description"
                v-model="chapter.description"
              >
              <span>Chapter Number:</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="leave blank for un-numbered items"
                v-model="chapter.count"
              >
              <span>Filename:</span>
              <input type="text" class="form-control mb-2" placeholder v-model="chapter.filename">
            </div>
          </div>
        </div>
        <button class="button" @click="saveForm">Save</button>
        <br>
        <br>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { seriesMixin } from '@/mixins/SeriesMixin.js'
export default {
  mixins: [bookMarkMixin, seriesMixin],
  props: ['countryCODE', 'languageISO', 'bookNAME'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    NavBar
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
        text.description = this.description
        console.log('text.description')
        console.log(text.description)
        text.text = this.chapters
        var valid = ContentService.validate(text)
        this.content.text = JSON.stringify(valid)
        this.content.filename = this.$route.params.bookNAME + '-chapters'
        this.content.filetype = 'json'
        this.content.country_iso = this.$route.params.countryCODE
        this.content.language_iso = this.$route.params.languageISO
        this.content.folder = this.bookmark.book.folder
        console.log('this.content')
        console.log(this.content)
        this.$store.dispatch('newBookmark', 'clear')
        await ContentService.createContentData(this.content)
        this.$router.push({
          name: 'previewSeries',
          params: {
            countryCODE: this.$route.params.countryCODE,
            languageISO: this.$route.params.languageISO,
            bookNAME: this.$route.params.bookNAME
          }
        })
      } catch (error) {
        console.log('LIBRARY EDIT There was an error ', error) //
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      this.getSeries(this.$route.params)
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
