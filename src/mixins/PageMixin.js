import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
export const pageMixin = {
  data() {
    return {
      pageText: '',
      loading: false,
      loaded: null,
      error: null,
      read: false,
      write: false,
      publish: false,
      publish_date: null,
      prototype: false,
      prototype_date: null,
      image_class: 'book',
      show_page_title: false,
      show_series_title: false,
      recnum: null,
      header: 'series'
    }
  },
  methods: {
    async getPage() {
      try {
        await this.UnsetBookmarks()
        this.error = this.loaded = null
        this.loading = true
        this.countries = []
        await this.CheckBookmarks(this.$route.params)
        this.image_dir = this.standard.image_dir
        if (this.bookmark.language) {
          this.image_dir = this.bookmark.language.image_dir
        }
        this.image = this.standard.image
        this.image_class = 'book'
        this.style = this.standard.style
        this.show_page_title = true
        this.show_series_title = true
        if (this.bookmark.language.titles) {
          this.show_series_title = false
        }
        if (this.bookmark.book) {
          this.style = this.bookmark.book.style
        }
        if (this.bookmark.page.image) {
          this.image = this.bookmark.page.image
          this.image_class = 'something'
          this.show_page_title = false
        } else {
          if (this.bookmark.book) {
            this.image = this.bookmark.book.image
          }
        }
        this.book_image =
          this.appDir.library + this.image_dir + '/' + this.image

        var response = await ContentService.getPage(this.$route.params)
        if (response.data.content.recnum) {
          this.recnum = response.data.content.recnum
          this.publish_date = response.data.content.publish_date
          this.prototype_date = response.data.content.prototype_date
        }
        this.pageText = response.data.content.text
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('No existing page was found') // Logs out the error
        if (this.$route.name != 'editPage') {
          var css = this.bookmark.page.style
            ? this.bookmark.page.style
            : 'ZZ/styles/myfriendsGLOBAL.css'
          css.replace('/', '@')
          this.$route.params.cssFORMATTED = css
          this.$router.push({
            name: 'editPage',
            params: this.$route.params
          })
        }
        if (this.bookmark.book.template) {
          this.$route.params.template = this.bookmark.book.template
          response = await AuthorService.getTemplate(this.$route.params)
          // is this coming from database
          console.log('line 63 in mixin')
          console.log(response)
          if (response.data.content.recnum) {
            this.recnum = response.data.content.recnum
            this.publish_date = response.data.content.publish_date
          }
          this.pageText = response.data.content.text
          this.loaded = true
          this.loading = false
        } else {
          this.pageText =
            'No text found.  It would be faster if you created a template'
          this.loaded = true
          this.loading = false
        }
      }
    }
  }
}
