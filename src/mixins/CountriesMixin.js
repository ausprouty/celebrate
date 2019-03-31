import ContentService from '@/services/ContentService.js'
export const countriesMixin = {
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
        this.loaded = true
        this.loading = false
      } catch (error) {
        console.log('There was an error in CountriesMixin:', error) // Logs out the error
      }
    },
    async showPage(country) {
      var ref = this
      localStorage.setItem('lastPage', 'countries')
      this.$route.params.countryCODE = country.code
      var res = await ContentService.getLanguages(this.$route.params)
      var response = res.data.content.text
      console.log('COUNTRY PREVIEW - response ')
      console.log(response)
      console.log('COUNTRY PREVIEW - length is ' + response.length)
      if (response.length === 1) {
        var link = 'Library'
        if (this.$route.params.version == 'latest'){
          link = 'previewLibrary'
        }
        var language = response[0]
        ref.$router.push({
          name: link,
          params: {
            countryCODE: country.code,
            languageISO: language.iso
          }
        })
      } else {
        var link = 'Languages'
        if (this.$route.params.version == 'latest'){
          link = 'previewLanguages'
        }
        ref.$router.push({
          name: link,
          params: { countryCODE: country.code }
        })
      }
    }
  }
}
