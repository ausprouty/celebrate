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
      error_message: null,
      prototype: false,
      prototype_date: null,
      publish: false,
      publish_date: null,
      recnum: null
    }
  },
  methods: {
    async getLanguages() {
      try {
        this.error = this.loaded = null
        this.loading = true
        this.languages = []
        // console.log('about the check bookmarks')
        await this.CheckBookmarks(this.$route.params)
        var response = await ContentService.getLanguages(this.$route.params)
        //console.log('get languages')
        //console.log(response)
        this.languages = response.data.content.text
        if (response.data.content.recnum) {
          this.recnum = response.data.content.recnum
          this.publish_date = response.data.content.publish_date
          this.prototype_date = response.data.content.prototype_date
        }
      } catch (error) {
        console.log('There was an error in LanguageMixin:', error) // Logs out the error
      }
    }
  }
}
