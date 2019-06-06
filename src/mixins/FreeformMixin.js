import ContentService from '@/services/ContentService.js'
export const FreeformMixin = {
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
      recnum: null
    }
  },
  methods: {
    async getFreeform() {
      try {
        await this.UnsetBookmarks()
        this.error = this.loaded = null
        this.loading = true
        this.countries = []
        // needed becaise CheckBookMarks messes with fileFILENAME
        this.$route.params.pageNAME = this.$route.params.fileFILENAME
        await this.CheckBookmarks(this.$route.params)
        // need folder to get correct page
        this.$route.params.fileFILENAME = this.$route.params.pageNAME
        this.$route.params.folderNAME = this.bookmark.book.folder
        this.image_dir = this.standard.image_dir
        if (this.bookmark.language) {
          this.image_dir = this.bookmark.language.image_dir
        }
        this.image = this.standard.image
        this.style = this.standard.style
        if (this.bookmark.book) {
          this.image = this.bookmark.book.image
          this.style = this.bookmark.book.style
        }
        this.book_image =
          this.appDir.library + this.image_dir + '/' + this.image

        var response = await ContentService.getPage(this.$route.params)
        if (response.data.content.recnum) {
          this.recnum = response.data.content.recnum
          this.publish_date = response.data.content.publish_date
        }
        this.pageText = response.data.content.text
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('No existing page was found') // Logs out the error
      }
    }
  }
}
