<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Library</h1>
      <div>
        <draggable v-model="library">
          <transition-group>
            <div v-for="book in library" :key="book.id" :book="book">
              <div class="shadow-card -shadow">
                <img v-bind:src="appDir.icons +'move2red.png' " class="sortable">
                <span class="card-name">{{book.title}}</span>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
    <button class="button" @click="saveForm">Save</button>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
export default {
  components: {
    NavBar,
    draggable
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
            name: 'previewLibrary',
            params: {
              countryCODE: ref.$route.params.countryCODE,
              languageISO: ref.$route.params.languageISO
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
    ContentService.getLibrary(this.$route.params).then(response => {
      console.log('response from edit service')
      console.log(response.data)
      if (!response.data.content) {
        console.log('I am going to content for library')
        ContentService.getLibrary(this.$route.params)
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
    })
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
