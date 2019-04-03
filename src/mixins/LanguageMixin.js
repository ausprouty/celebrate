import ContentService from '@/services/ContentService.js'
export const languageMixin = {
  data() {
    return {
      language: [],
      languages: [
        {
          id: '',
          folder: '',
          iso: '',
          name: '',
          image_dir: '',
          rldir: 'ltr'
        }
      ],
      loading: false,
      loaded: null,
      error: null,
      content: {
        recnum: '',
        version: '',
        edit_date: '',
        edit_uid: '',
        publish_uid: '',
        publish_date: '',
        language_iso: '',
        country_iso: '',
        folder: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      }
    }
  },
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
