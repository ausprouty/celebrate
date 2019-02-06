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
              <input
                type="text"
                class="form-control mb-2"
                placeholder=""
                v-model="chapter.filename"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Chapter from '@/components/Chapter.vue'
import DataService from '@/services/DataService.js'
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
      error: null
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
    this.$store.dispatch('checkBookmark', route).then(response => {
      DataService.getSeries(
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
