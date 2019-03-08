<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Library</h1>
      <div>
        <button class="button" @click="addNewBookForm">New Book</button>
        <div v-for="(book, index) in library" :key="book.code" :book="book">
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteBookForm(index)">X</div>
            <h4 class="card-title">Book #{{index}}</h4>
            <div class="form">
              <span>Title:</span>
              <input type="text" class="form-control mb-2" placeholder="Title" v-model="book.title">
              <br>
              <br>
              <img v-bind:src="appDir.library  + image_dir  + '/' + book.image" class="book">
              <br>
              <span>Image:</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="myfriends"
                v-model="book.image"
              >
              
              <span>Book:</span>
              <select v-model="book.book">
                <option value="issues">Issues</option>
                <option value="basics">Basics</option>
                <option value="community">Community</option>
                <option value="firststeps">First Steps</option>
                <option value="compass">Compass</option>
                <option value="about">About</option>
              </select>
              
              <span>Folder:</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="myfriends"
                v-model="book.folder"
              >
              <span>Format:</span>
              <select v-model="book.format">
                <option value="series">series</option>
                <option value="page">page</option>
              </select>
              <div v-if="book.format == 'series'">
                <span>Index</span>
                <input
                  type="text"
                  class="form-control mb-2"
                  placeholder="basics-chapters.json"
                  v-model="book.index"
                >
              </div>
              <span>Style Sheet</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="AU-myfriends.css"
                v-model="book.style"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="button" @click="saveForm">Save</button>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import EditService from '@/services/EditService.js'
import { mapState } from 'vuex'
export default {
  components: {
    NavBar
  },
  props: ['countryCODE', 'languageISO'],
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  data() {
    return {
      library: [
        {
          id: '',
          book: '',
          title: '',
          folder: '',
          index: '',
          style: 'AU-myfriends.css',
          image: 'issues.jpg',
          format: 'series'
        }
      ],
      image_dir: 'menu-europe',
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
    saveForm() {
      console.log(this.content)
      this.content.text = JSON.stringify(this.library)
      this.content.filename = 'library'
      this.content.filetype = 'json'
      this.content.country_iso = this.$route.params.countryCODE
      this.content.language_iso = this.$route.params.languageISO
      var contentForm = this.toFormData(this.content)
      var ref = this
      EditService.createContent(contentForm).then(function(response) {
        if (response.data.error) {
          ref.errorMessage = response.data.message
        } else {
          // this.successMessage = response.data.message
          //ref.getCountries()
          ref.$router.push({
            name: 'previewLibrary',
            params: {
              countryCODE: ref.$route.params.countryCODE,
              languageISO: ref.$route.params.languageISO
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
    var ref = this
    this.$store.dispatch('checkBookmark', route)
    EditService.getLibrary(route.country, route.language, this.revision).then(
      response => {
        console.log('response from edit service')
        console.log(response.data)
        if (!response.data.content) {
          console.log('I am going to content for library')
          ContentService.getLibrary(route.country, route.language)
            .then(response => {
              ref.library = response.data
              if (typeof ref.bookmark.language != 'undefined') {
                console.log('USING BOOKMARK')
                console.log(ref.bookmark.language)
                this.image_dir = ref.bookmark.language.image_dir
                console.log(ref.image_dir)
              } else {
                console.log('USING STANDARD')
                ref.image_dir = ref.standard.image_dir
              }
              ref.loading = false
              ref.loaded = true
            })
            .catch(error => {
              ref.library = [
                {
                  id: 1,
                  book: 'issues',
                  title: 'Life Issues',
                  folder: 'myfriends',
                  index: 'principle-chapters',
                  style: 'AU-myfriends.css',
                  image: 'issues.jpg',
                  format: 'series'
                },
                {
                  id: 2,
                  book: 'basics',
                  title: 'Basic Conversations',
                  folder: 'myfriends',
                  index: 'basics-chapters.json',
                  style: 'AU-myfriends.css',
                  image: 'basics.jpg',
                  format: 'series'
                },
                {
                  id: 3,
                  book: 'community',
                  title: 'Live Community',
                  folder: 'myfriends',
                  page: 'community',
                  style: 'AU-myfriends.css',
                  image: 'community.jpg',
                  format: 'page'
                },
                {
                  id: 4,
                  book: 'firststeps',
                  title: 'First Steps',
                  folder: 'first_steps',
                  index: 'first_steps-chapters',
                  style: 'AU-fsteps.css',
                  image: 'firststeps.jpg',
                  format: 'series'
                },
                {
                  id: 5,
                  book: 'compass',
                  title: 'Compass',
                  folder: 'compass',
                  index: 'compass-chapters',
                  style: 'AU-compass.css',
                  image: 'compass.jpg',
                  format: 'series'
                },
                {
                  id: 6,
                  book: 'about',
                  title: 'About MyFriends',
                  folder: 'myfriends',
                  page: 'community',
                  style: 'AU-myfriends.css',
                  image: 'about.jpg',
                  format: 'page'
                }
              ]
              ref.image_dir = ref.standard.image_dir
              ref.loading = false
              ref.loaded = true
            })
        } else {
          ref.content.recnum = ''
          ref.content.version = ''
          ref.content.publish_uid = response.data.content.publish_uid
          ref.content.publish_date = response.data.content.publish_date
          ref.content.language_iso = route.language
          ref.content.country_iso = route.country
          ref.content.folder = ''
          ref.content.filetype = 'json'
          ref.content.title = ''
          ref.content.filename = 'library'
          ref.content.library = JSON.parse(response.data.content.text)
          ref.loaded = true
          ref.loading = false
          ref.library = ref.content.library
          console.log(ref.content.library)
        }
      }
    )
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
