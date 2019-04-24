import ContentService from '@/services/ContentService.js'
export const languageMixin = {
  data() {
    return {
      language: [],
      languages: [],
      content: {},
      loading: false,
      loaded: null,
      error: null,
      error_message: null
    }
  },
  methods: {
    async getLanguages() {
      try {
        this.error = this.loaded = null
        this.loading = true
        this.languages = []
        console.log('about the check bookmarks')
        await this.CheckBookmarks(this.$route.params)
        var response = await ContentService.getLanguages(this.$route.params)
        console.log('get languages')
        console.log(response)
        this.languages = response.data.content.text
      } catch (error) {
        console.log('There was an error in LanguageMixin:', error) // Logs out the error
      }
    }
  }
}
