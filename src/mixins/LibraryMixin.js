import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
export const libraryMixin = {
  data() {
    return {
      library: [
        {
          id: '',
          code: '',
          title: '',
          folder: '',
          index: '',
          style: 'AU-myfriends.css',
          image: 'issues.jpg',
          format: 'series'
        }
      ],
      image_dir: 'ZZ/images/GLOBAL',
      loading: false,
      loaded: '',
      error: '',
      error_message: '',
      rldir: 'ltr',
      prototype: false,
      prototype_date: null,
      books: [],
      write: false,
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
        folder_name: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      }
    }
  },
  methods: {
    async getLibrary() {
      console.log('started getLibrary in LibraryMixin')
      try {
        this.error = this.loaded = ''
        this.loading = true

        if (!this.$route.params.library_code) {
          this.$route.params.library_code = 'library'
        } else {
          if (this.$route.params.library_code.includes('.html')) {
            this.$route.params.library_code = this.$route.params.library_code.slice(
              0,
              -5
            )
          }
        }
        //console.log('getLibrary goin to check bookmarks with:')
        // console.log(this.$route.params)
        await this.CheckBookmarks(this.$route.params)
        var response = await ContentService.getLibrary(this.$route.params)
        console.log(this.bookmark)
        console.log(response)
        if (this.bookmark.library.books == null) {
          this.bookmark.library.books = response.data.content.text
        }
        console.log('Library Data obtained:')
        console.log(response.data.content.text)
        if (response.data.content.text) {
          // divide response into three component parts
          this.books = response.data.content.text.books
            ? response.data.content.text.books
            : response.data.content.text // from legacy data
          if (typeof response.data.content.text.format != 'undefined') {
            this.format = response.data.content.text.format
            if (typeof this.format.image.image == 'undefined') {
              this.format.image.image = this.image
              this.format.image.title = 'Unknown'
            }
          } else {
            // we have legacy data
            console.log('we have legacy data')
            this.format = {}
            this.format.image = {}
            this.format.image.title = 'FriendsHeader.png'
            this.format.image.image =
              '/content/' +
              this.$route.params.country_code +
              '/images/standard/FriendsHeader.png'
            this.format.replace_header = true
            console.log('set header')
            this.format.style = '/content/ZZ/styles/myfriendsGLOBAL.css'
            this.format.back_button = {}
            this.format.back_button.title = 'back-ribbon-red.png'
            this.format.back_button.image =
              '/content/ZZ/images/ribbons/back-ribbon-red.png'
            this.format.no_ribbon = true
            // not clean up images for books
            console.log('clean books')
            console.log(this.books.length)
            var length = this.books.length

            for (var i = 0; i < length; i++) {
              var image = {}
              image.title = this.books[i].image
              image.image =
                '/content/' +
                this.$route.params.country_code +
                '/images/standard/' +
                this.books[i].image
              this.books[i].image = image
              this.books[i].publish = true
            }
          }
          this.text = response.data.content.text.text
            ? response.data.content.text.text
            : ''
          console.log('this.format')
          console.log(this.format)
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
        this.rldir = this.bookmark.language.rldir
        //console.log('this.image_dir')
        // console.log(this.image_dir)
      } catch (error) {
        this.newLibrary()
        console.log('There was an error in LibraryMixin:', error) // Logs out the error
      }
    },
    async getImages(directory) {
      // get images for library header
      var options = []
      var param = {}
      param.route = JSON.stringify(this.$route.params)
      param.image_dir = directory
      var img = await AuthorService.getImages(param)
      if (typeof img !== 'undefined') {
        // img.push('')
        img = img.sort()
        var length = img.length
        var i = 0
        for (i = 0; i < length; i++) {
          var formatted = {}
          formatted.title = img[i]
          formatted.image = '/content/' + directory + '/' + img[i]
          options.push(formatted)
        }
      }
      console.log('from getImages for ' + directory)
      console.log(options)
      return options
    },
    async getLibraryIndex() {
      this.error = this.loaded = null
      this.loading = true
      this.recnum = null
      this.publish_date = null
      await this.UnsetBookmarks()
      await this.CheckBookmarks(this.$route.params)
      console.log('getLibraryIndex parameters')
      console.log(this.$route.params)
      var response = await ContentService.getLibraryIndex(this.$route.params)
      console.log('response')
      console.log(response)
      if (response.data.content) {
        if (response.data.content.recnum) {
          this.recnum = response.data.content.recnum
          this.publish_date = response.data.content.publish_date
          this.prototype_date = response.data.content.prototype_date
        }
      }
      console.log('from ContentService.getCountry in LibraryMixin')
      console.log(response.data.content)
      //var text = JSON.parse(response.data.content.text)
      var text = response.data.content.text
      console.log('text')
      console.log(text)
      this.pageText = text.page
      this.style = text.style
      this.footerText = text.footer
      this.loaded = true
      this.loading = false
    },
    newLibrary() {
      this.books = [
        {
          id: 1,
          code: 'life',
          title: 'Life Principles',
          image: 'life.jpg',
          format: 'series',
          style: 'ZZ-myfriends.css'
        },
        {
          id: 2,
          code: 'basics',
          title: 'Basic Conversations',
          image: 'basics.jpg',
          format: 'series',
          style: 'ZZ-myfriends.css'
        },
        {
          id: 3,
          code: 'community',
          title: 'Live Community',
          image: 'community.jpg',
          format: 'page',
          page: 'community',
          style: 'ZZ-myfriends.css'
        },
        {
          id: 4,
          code: 'steps',
          title: 'First Steps',
          image: 'firststeps.jpg',
          format: 'series',
          style: 'ZZ-steps.css'
        },
        {
          id: 5,
          code: 'compass',
          title: 'Compass',
          image: 'compass.jpg',
          format: 'series',
          style: 'ZZ-compass.css'
        },
        {
          id: 6,
          code: 'about',
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
