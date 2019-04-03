import ContentService from '@/services/ContentService.js'
export const libraryMixin = {
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
    async getLibrary() {
      try {
        this.error = this.loaded = null
        this.loading = true
        await this.CheckBookmarks(this.$route.params)
        var response = await ContentService.getLibrary(this.$route.params)
        console.log('Page View Data obtained')
        if (response.data.content.text) {
          this.library = response.data.content.text
        } else {
          this.newLibrary()
        }
        this.image_dir = this.standard.image_dir
        if (typeof this.bookmark.language.image_dir != 'undefined') {
          console.log('USING BOOKMARK')
          this.image_dir = this.bookmark.language.image_dir
        }
        console.log('this.image_dir')
        console.log(this.image_dir)
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in LibraryMixin:', error) // Logs out the error
      }
    },
    newLibrary() {
      this.library = [
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
    }
  }
}
