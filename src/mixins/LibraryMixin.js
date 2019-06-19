import ContentService from '@/services/ContentService.js'
export const libraryMixin = {
  data() {
    return {
      library: [
        {
          id: '',
          name: '',
          title: '',
          folder: '',
          index: '',
          style: 'AU-myfriends.css',
          image: 'issues.jpg',
          format: 'series'
        }
      ],
      image_dir: 'ZZ/images/europe',
      loading: false,
      loaded: '',
      error: '',
      error_message: '',
      prototype: false,
      prototype_date: null,
      publish: false,
      publish_date: '',
      recnum: '',
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
        this.error = this.loaded = ''
        this.loading = true

        if (!this.$route.params.libraryCODE) {
          this.$route.params.libraryCODE = 'library'
        } else {
          if (this.$route.params.libraryCODE.includes('.html')) {
            this.$route.params.libraryCODE = this.$route.params.libraryCODE.slice(
              0,
              -5
            )
          }
        }
        console.log('getLibrary Params')
        console.log(this.$route.params)
        //console.log('getLibrary goin to check bookmarks with:')
        // console.log(this.$route.params)
        await this.CheckBookmarks(this.$route.params)
        console.log('getLibrary Params')
        console.log(this.$route.params)
        var response = await ContentService.getLibrary(this.$route.params)
        //console.log('Library Data obtained:')
        //console.log(response.data.content.text)
        if (response.data.content.text) {
          this.library = response.data.content.text.books
            ? response.data.content.text.books
            : []
          this.image = response.data.content.text.image
            ? response.data.content.text.image
            : ''
          this.text = response.data.content.text.text
            ? response.data.content.text.text
            : ''
          if (response.data.content.recnum) {
            this.recnum = response.data.content.recnum
            this.publish_date = response.data.content.publish_date
            this.prototype_date = response.data.content.prototype_date
          } else {
            this.recnum = this.publish_date = ''
          }
        } else {
          // you are never going to get here because you will get an error from ContentService.getLibrary
          console.log('going to newLibrary from getLibrary')
          this.newLibrary()
        }
        this.image_dir = this.standard.image_dir
        if (typeof this.bookmark.language.image_dir != 'undefined') {
          // console.log('get Library is using Bookmark')
          this.image_dir = this.bookmark.language.image_dir
        }
        //console.log('this.image_dir')
        // console.log(this.image_dir)
      } catch (error) {
        this.newLibrary()
        console.log('There was an error in LibraryMixin:', error) // Logs out the error
      }
    },
    newLibrary() {
      this.library = [
        {
          id: 1,
          name: 'life',
          title: 'Life Principles',
          image: 'life.jpg',
          format: 'series',
          style: 'ZZ-myfriends.css'
        },
        {
          id: 2,
          name: 'basics',
          title: 'Basic Conversations',
          image: 'basics.jpg',
          format: 'series',
          style: 'ZZ-myfriends.css'
        },
        {
          id: 3,
          name: 'community',
          title: 'Live Community',
          image: 'community.jpg',
          format: 'page',
          page: 'community',
          style: 'ZZ-myfriends.css'
        },
        {
          id: 4,
          name: 'steps',
          title: 'First Steps',
          image: 'firststeps.jpg',
          format: 'series',
          style: 'ZZ-steps.css'
        },
        {
          id: 5,
          name: 'compass',
          title: 'Compass',
          image: 'compass.jpg',
          format: 'series',
          style: 'ZZ-compass.css'
        },
        {
          id: 6,
          name: 'about',
          title: 'About MyFriends',
          image: 'about.jpg',
          format: 'page',
          page: 'community',
          style: 'ZZ-myfriends.css'
        }
      ]
    }
  }
}
