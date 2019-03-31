import ContentService from '@/services/ContentService.js'
export const countryMixin = {
  methods: {
    async getCountries() {
      try {
        this.error = this.loaded = null
        this.loading = true
        this.countries = []
        await this.CheckBookmarks(this.$route.params)
        var response = await ContentService.getCountries(this.$route.params)
        console.log('Page View Data obtained')
        this.countries = response.data.content.text
      } catch (error) {
        console.log('There was an error in Countries.vue:', error) // Logs out the error
      }
    }
  }
}
