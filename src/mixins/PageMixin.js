import ContentService from '@/services/ContentService.js'
export const pageMixin = {
  methods: {
    async getPage() {
      try {
        this.error = this.loaded = null
        this.loading = true
        this.countries = []
        await this.CheckBookmarks(this.$route.params)
        var response = await ContentService.getPage(this.$route.params)
        console.log('Page View Data obtained')
        this.countries = response.data.content.text
        
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

        this.book_image = this.appDir.library + this.image_dir + '/' + this.image
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in PageMixin:', error) // Logs out the error
      }
    },
    
}
