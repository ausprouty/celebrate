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
        <textarea v-model="seriesDetails.description" placeholder="add multiple lines"></textarea>
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
export default {
  props: ['countryCODE', 'languageISO', 'folderNAME', 'fileFILENAME'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    NavBar
  },
  data() {
    return {
      seriesDetails: {
        series: '',
        language: '',
        description: ''
      },
      chapter: {},
      chapters: [
        {
          id: '',
          title: '',
          desciption: '',
          count: '',
          filename: ''
        }
      ],
      dir: 'ltr',
      loadinG: false,
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
    saveForm() {
      console.log(this.content)
      var text = this.seriesDetails
      text.text = this.chapters
      this.content.text = JSON.stringify(text)
      this.content.filename = this.$route.params.bookNAME + '-chapters'
      this.content.filetype = 'json'
      this.content.country_iso = this.$route.params.countryCODE
      this.content.language_iso = this.$route.params.languageISO
      this.content.folder = this.bookmark.book.folder
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
            name: 'previewSeries',
            params: {
              countryCODE: ref.$route.params.countryCODE,
              languageISO: ref.$route.params.languageISO,
              bookNAME: ref.$route.params.bookNAME
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
    this.error = this.loaded = null
    this.loading = true
    var ref = this
    var route = {}
    route.country = this.$route.params.countryCODE
    route.language = this.$route.params.languageISO
    route.book = this.$route.params.bookNAME // we need book to get style sheet
    route.series = this.$route.params.bookNAME
    route.version = 'latest'
    this.$store.dispatch('checkBookmark', route).then(response => {
      ContentService.getSeries(
        route.country,
        route.language,
        this.bookmark.book.folder,
        this.bookmark.book.index,
        route.version
      )
        .then(response => {
          console.log('SERIES EDIT -- response.data')
          console.log(response.data) // For nseriesDetailsow, logs out the response
          ref.seriesDetails = response.data.content
          console.log('SERIES EDIT --this.seriesDetails')
          console.log(this.seriesDetails)

          ref.chapters = ref.seriesDetails.chapters
          console.log('SERIES EDIT -- chapters in Series.Vue')
          console.log(this.chapters)
          ref.loading = false
          ref.loaded = true
        })
        .catch(error => {
          ref.loading = false
          console.log('SERIES EDIT --There was an error:', error.response) // Logs out the error
          ref.error = error.toString()
        })
    })
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
