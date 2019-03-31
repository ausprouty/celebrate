import ContentService from '@/services/ContentService.js'
export const libraryMixin = {
  methods: {
    async getLibrary() {
      try {
        this.error = this.loaded = null
        this.loading = true
        this.countries = []
        await this.CheckBookmarks(this.$route.params)
        var response = await ContentService.getLibrary(this.$route.params)
        console.log('Page View Data obtained')
        this.library = response.data.content.text
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in LibraryMixin:', error) // Logs out the error
      }
    }
  }
}
