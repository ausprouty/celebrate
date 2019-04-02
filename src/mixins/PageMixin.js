import ContentService from '@/services/ContentService.js'
export const pageMixin = {
  methods: {
    async getPage() {
      try {
        await this.UnsetBookmarks();
        this.error = this.loaded = null
        this.loading = true
        this.countries = []
        console.log ('PAGE MIXIN -- params before bookmark')
        console.log (this.$route.params)
        // needed becaise CheckBookMarks messes with fileFILENAME
        this.$route.params.pageNAME = this.$route.params.fileFILENAME
        await this.CheckBookmarks(this.$route.params)
        // need folder to get correct page
        this.$route.params.fileFILENAME = this.$route.params.pageNAME
        this.$route.params.folderNAME = this.bookmark.book.folder
        console.log ('PAGE MIXIN -- params after bookmark')
        console.log (this.$route.params)
        var response = await ContentService.getPage(this.$route.params)
        console.log('Page View Data obtained')
        this.pageText = response.data.content.text

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
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in PageMixin:', error) // Logs out the error
      }
    }
  }
}
