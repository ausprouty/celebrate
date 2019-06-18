import ContentService from '@/services/ContentService.js'
export const countriesMixin = {
  data() {
    return {
      countries: [
        {
          name: null,
          english: null,
          code: null,
          index: null,
          image: null,
          publish: null
        }
      ],
      loading: false,
      loaded: null,
      error: null,
      error_message: null,
      publish: false,
      publish_date: null,

      recnum: null,
      content: {
        recnum: '',
        version: '',
        edit_date: '',
        edit_uid: '',
        publish_uid: '',
        publish_date: '',
        language_iso: '',
        country_code: '',
        folder: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      }
    }
  },
  methods: {
    async getCountries() {
      try {
        this.error = this.loaded = null
        this.loading = true
        this.countries = []
        await this.CheckBookmarks(this.$route.params)
        var response = await ContentService.getCountries(this.$route.params)
        console.log('Page View Data obtained')
        console.log(response)
        this.countries = response.data.content.text
        if (response.data.content.recnum) {
          this.recnum = response.data.content.recnum
          this.publish_date = response.data.content.publish_date
        }
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in CountriesMixin:', error) // Logs out the error
      }
    },
    async showPage(country) {
      localStorage.setItem('lastPage', 'countries')
      this.$route.params.countryCODE = country.code
      var link = ''
      var res = await ContentService.getLanguages(this.$route.params)
      var response = res.data.content.text
      // console.log('COUNTRY PREVIEW - response ')
      // console.log(response)
      // console.log('COUNTRY PREVIEW - length is ' + response.length)
      if (response.length === 1) {
        link = 'library'
        if (this.$route.params.version == 'latest') {
          link = 'previewLibrary'
        }
        var language = response[0]
        this.$router.push({
          name: link,
          params: {
            countryCODE: country.code,
            languageISO: language.iso
          }
        })
      } else {
        link = 'languages'
        if (this.$route.params.version == 'latest') {
          link = 'previewLanguages'
        }

        this.$router.push({
          name: link,
          params: { countryCODE: country.code }
        })
      }
    }
  }
}
