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

      if (response.data.content.recnum) {
        this.recnum = response.data.content.recnum
        this.publish_date = response.data.content.publish_date
      }
      this.pageText = response.data.content.text
      this.loaded = true
      this.loading = false
    }
  }
}
