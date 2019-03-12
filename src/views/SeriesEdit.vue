<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Series for {{this.$route.params.countryCODE}}</h1>
      <div class="form">
        <span>Description:</span>
        <br>
        <textarea v-model="seriesDetails.description" placeholder="add multiple lines"></textarea>
      </div>
      <div>
        <button class="button" @click="addNewChapterForm">New Chapter</button>
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
      </div>
    </div>
    <button class="button" @click="saveForm">Save</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/Chapter.vue'
import ContentService from '@/services/ContentService.js'
import NavBar from '@/components/NavBarAdmin.vue'
export default {
  props: ['countryCODE', 'languageISO', 'bookNAME'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    Chapter,
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
      this.content.text = JSON.stringify(this.chapters)
      this.content.filename = this.$route.params.bookNAME + '-chapters'
      this.content.filetype = 'json'
      this.content.country_iso = this.$route.params.countryCODE
      this.content.language_iso = this.$route.params.languageISO
      this.content.section = this.$route.params.bookNAME
      var contentForm = this.toFormData(this.content)
      var ref = this
      ContentService.createContent(contentForm).then(function(response) {
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
    },
    toFormData(obj) {
      this.content.edit_date = ''
      this.content.edit_uid = ''
      var form_data = new FormData()
      for (var key in obj) {
        form_data.append(key, obj[key])
      }
      this.content.text = ''
      console.log('form_data')
      // Display the key/value pairs
      for (var pair of form_data.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }
      return form_data
    }
  },
  created() {
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.$route.params.countryCODE
    route.language = this.$route.params.languageISO
    route.book = this.$route.params.bookNAME // we need book to get style sheet
    route.series = this.$route.params.bookNAME
    route.revison = 'latest'
    this.$store.dispatch('checkBookmark', route).then(response => {
      ContentService.getSeries(
        route.country,
        route.language,
        this.bookmark.book.folder,
        this.bookmark.book.index
      )
        .then(response => {
          console.log(response.data) // For nseriesDetailsow, logs out the response
          this.seriesDetails = response.data
          console.log('this.seriesDetails')
          console.log(this.seriesDetails)

          this.chapters = this.seriesDetails.chapters
          console.log('chapters in Series.Vue')
          console.log(this.chapters)
          this.loading = false
          this.loaded = true
        })
        .catch(error => {
          this.loading = false
          console.log('There was an error:', error.response) // Logs out the error
          this.error = error.toString()
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
