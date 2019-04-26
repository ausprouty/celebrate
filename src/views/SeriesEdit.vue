<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{this.error_message}}</div>
    <div class="content" v-if="loaded">
      <h1>Series for {{this.$route.params.countryCODE}}</h1>
      <div class="form">
        <span>Series Description:</span>
        <br>
        <textarea v-model="description" placeholder="add multiple lines"></textarea>
      </div>
      <div>
        <div
          v-for="(chapter, index) in $v.chapters.$each.$iter"
          :key="chapter.id"
          :chapter="chapter"
        >
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteChapterForm(index)">X</div>
            <div class="form">
              <BaseInput
                v-model="chapter.count.$model"
                label="Chapter Number"
                type="text"
                placeholder="leave blank for un-numbered items"
                class="field"
                :class="{ error: chapter.count.$error }"
                @blur="chapter.count.$touch()"
              />
              <BaseInput
                v-model="chapter.title.$model"
                label="Title"
                type="text"
                placeholder
                class="field"
                :class="{ error: chapter.title.$error }"
                @blur="chapter.title.$touch()"
              />
              <template v-if="chapter.title.$error">
                <p v-if="!chapter.title.required" class="errorMessage">Title is required</p>
              </template>

              <BaseInput
                v-model="chapter.description.$model"
                label="Description:"
                type="text"
                placeholder
                class="field"
                :class="{ error: chapter.description.$error }"
                @blur="chapter.description.$touch()"
              />
              <template v-if="chapter.description.$error">
                <p v-if="!chapter.description.required" class="errorMessage">Description is required</p>
              </template>

              <BaseInput
                v-model="chapter.filename.$model"
                label="File Name"
                type="text"
                placeholder
                class="field"
                :class="{ error: chapter.filename.$error }"
                @blur="chapter.filename.$touch()"
              />
              <template v-if="chapter.filename.$error">
                <p v-if="!chapter.filename.required" class="errorMessage">Description is required</p>
              </template>
            </div>
          </div>
        </div>
        <div v-if="this.authorized">
          <button class="button" @click="addNewChapterForm">New Chapter</button>

          <div v-if="!$v.$anyError">
            <button class="button red" @click="saveForm">Save Changes</button>
          </div>
          <div v-if="$v.$anyError">
            <button class="button grey">Disabled</button>
            <p v-if="$v.$anyError" class="errorMessage">Please fill out the required field(s).</p>
          </div>
          <br>
          <br>
          <br>
        </div>
        <div v-if="!this.authorized">
          <p>
            You need to
            <a href="/login">login to make changes</a> here
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
import NavBar from '@/components/NavBarAdmin.vue'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { seriesMixin } from '@/mixins/SeriesMixin.js'
import { required } from 'vuelidate/lib/validators'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [bookMarkMixin, seriesMixin, authorMixin],
  props: ['countryCODE', 'languageISO', 'bookNAME'],
  computed: mapState(['bookmark', 'appDir']),
  components: {
    NavBar
  },
  data() {
    return {
      authorized: false,
      chapter: {
        title: '',
        description: '',
        count: '',
        filename: ''
      }
    }
  },
  validations: {
    chapters: {
      required,
      $each: {
        title: { required },
        description: {},
        count: '',
        filename: { required }
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
    async saveForm() {
      try {
        console.log(this.content)
        var text = {}
        text.description = this.description
        text.chapters = this.chapters
        console.log('text')
        console.log(text)
        var valid = ContentService.validate(text)
        this.content.text = JSON.stringify(valid)
        this.content.filename = this.bookmark.book.index
        this.content.filetype = 'json'
        this.content.country_code = this.$route.params.countryCODE
        this.content.language_iso = this.$route.params.languageISO
        this.content.folder = this.bookmark.book.folder
        console.log('this.content')
        console.log(this.content)
        this.$store.dispatch('newBookmark', 'clear')
        valid = await AuthorService.createContentData(this.content)
        this.$router.push({
          name: 'previewSeries',
          params: {
            countryCODE: this.$route.params.countryCODE,
            languageISO: this.$route.params.languageISO,
            bookNAME: this.$route.params.bookNAME
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
