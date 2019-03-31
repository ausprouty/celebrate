import ContentService from '@/services/ContentService.js'
export const languageMixin = {
  methods: {
    async getLanguages() {
      try {
        this.error = this.loaded = null
        this.loading = true
        this.countries = []
        await this.CheckBookmarks(this.$route.params)
        var response = await ContentService.getLanguages(this.$route.params)
        console.log('Page View Data obtained')
        this.languages = response.data.content.text
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in CountriesMixin:', error) // Logs out the error
      }
    }
  }
}
