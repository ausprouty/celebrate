import ContentService from '@/services/ContentService.js'
export const freeformMixin = {
  data() {
    return {
      pageText: '',
      loading: false,
      loaded: null,
      error: null,
      read: false,
      write: false,
      prototype: false,
      prototype_date: null,
      publish: false,
      publish_date: null,
      recnum: null
    }
  },
  methods: {
    async getCountry() {
      this.error = this.loaded = null
      this.loading = true
      this.recnum = null
      this.publish_date = null
      await this.UnsetBookmarks()
      await this.CheckBookmarks(this.$route.params)
      var response = await ContentService.getCountry(this.$route.params)
      if (response.data.content) {
        if (response.data.content.recnum) {
          this.recnum = response.data.content.recnum
          this.publish_date = response.data.content.publish_date
          this.prototype_date = response.data.content.prototype_date
        }
      }
      console.log ('from ContentService.getCountry in Freeform Mixin')
      console.log (response.data.content)
      //var text = JSON.parse(response.data.content.text)
      var text = response.data.content.text
      console.log ('text')
      console.log (text)
      this.pageText = text.page
      this.footerText = text.footer
      this.loaded = true
      this.loading = false
    },
    async getLibraryPage() {
      this.error = this.loaded = null
      this.loading = true
      this.recnum = null
      this.publish_date = null
      this.pageText = 'Ready to start editing?'
      await this.UnsetBookmarks()
      await this.CheckBookmarks(this.$route.params)
      var response = await ContentService.getLibraryPage(this.$route.params)
      if (response.data.content) {
        if (response.data.content.recnum) {
          this.recnum = response.data.content.recnum
          this.publish_date = response.data.content.publish_date
        }
        this.pageText = response.data.content.text
      }
      this.loaded = true
      this.loading = false
    },
    async getSeriesPage(params) {
      try {
        console.log('params in getSeriesPage')
        console.log(params)
        this.error = this.loaded = null
        this.loading = true
      
        var response = await ContentService.getSeriesPage(this.$route.params)
        console.log('Series Data obtained')
        console.log(response)
        if (response.source != 'none') {
          this.recnum = response.data.content.recnum
          this.publish_date = response.data.content.publish_date
          this.seriesDetails = JSON.parse(response.data.content.text)
          this.chapters = this.seriesDetails.chapters
          this.pageText = this.seriesDetails.description
          this.new = false
        } else {
          this.recnum = null
          this.publish_date = null
          this.pageText = 'Enter Image, backlink and text here'
          this.chapters = []
          this.new = true
        }
        this.loaded = true
        this.loading = false
        console.log('finished with get Series')
      } catch (error) {
        console.log('There was an error in FreeformMixin:', error) // Logs out the error
      }
    }
  }
}
