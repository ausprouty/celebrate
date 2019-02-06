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
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import DataService from '@/services/DataService.js'
//import Route from '../router.js'
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
      error: null
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
    }
  },
  created() {
    this.error = this.loaded = null
    this.loading = true
    var route = {}
    route.country = this.$route.params.countryCODE
    route.language = this.$route.params.languageISO
    this.$store.dispatch('checkBookmark', route).then(response => {
      // it is safer to get data each time tha rely on bookmark
      DataService.getLibrary(route.country, route.language)
        .then(response => {
          this.library = response.data
          if (typeof this.bookmark.language != 'undefined') {
            console.log('USING BOOKMARK')
            console.log(this.bookmark.language)
            this.image_dir = this.bookmark.language.image_dir
            console.log(this.image_dir)
          } else {
            console.log('USING STANDARD')
            this.image_dir = this.standard.image_dir
          }
          this.loading = false
          this.loaded = true
        })
        .catch(error => {
          this.library = [
            {
              id: 1,
              book: 'issues',
              title: 'Life Issues',
              folder: 'myfriends',
              index: 'principle-chapters.json',
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
              index: 'first_steps-chapters.json',
              style: 'AU-fsteps.css',
              image: 'firststeps.jpg',
              format: 'series'
            },
            {
              id: 5,
              book: 'compass',
              title: 'Compass',
              folder: 'compass',
              index: 'compass-chapters.json',
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
          this.image_dir = this.standard.image_dir
          this.loading = false
          this.loaded = true
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
