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
      error_message: null,
      publish: false,
      publish_date: null,
      recnum: null,
      content: {
        recnum: '',
        version: '',
        edit_date: '',
        edit_uid: '',
        publish_uid: '',
        publish_date: '',
        language_iso: '',
        country_code: '',
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
        console.log('getLibrary goin to check bookmarks with:')
        console.log(this.$route.params)
        await this.CheckBookmarks(this.$route.params)
        console.log(this.bookmark)
        var response = await ContentService.getLibrary(this.$route.params)
        console.log('Library Data obtained:')
        console.log(response.data.content.text)
        if (response.data.content.text) {
          this.library = response.data.content.text
          if (response.data.content.recnum) {
            this.recnum = response.data.content.recnum
            this.publish_date = response.data.content.publish_date
          }
        } else {  // you are never going to get here because you will get an error from ContentService.getLibrary
          this.newLibrary()
        }
        this.image_dir = this.standard.image_dir
        if (typeof this.bookmark.language.image_dir != 'undefined') {
          console.log('get Library is using Bookmark')
          this.image_dir = this.bookmark.language.image_dir
        }
        console.log('this.image_dir')
        console.log(this.image_dir)
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
