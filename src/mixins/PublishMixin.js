export const publishMixin = {
  methods: {
    mayPublishLanguages() {
      if (!this.authorize('publish', this.$route.params.country_code)) {
        return false
      }
      return this.bookmark.country.publish
    },
    mayPublishLibrary() {
      if (!this.authorize('publish', this.$route.params.country_code)) {
        return false
      }
      if (this.bookmark.country.publish && this.bookmark.language.publish) {
        return true
      } else {
        return false
      }
    },
    mayPublishSeries() {
      console.log('mayPublishSeries called')
      if (!this.authorize('publish', this.$route.params.country_code)) {
        console.log('mayPublishSeries returned false')
        return false
      }
      if (
        this.bookmark.country.publish &&
        this.bookmark.language.publish &&
        this.bookmark.book.publish
      ) {
        console.log('mayPublishSeries returned true')
        return true
      } else {
        return false
      }
    },
    mayPublishPage() {
      if (!this.authorize('publish', this.$route.params.country_code)) {
        return false
      }
      if (
        this.bookmark.country.publish &&
        this.bookmark.language.publish &&
        this.bookmark.book.publish &&
        this.bookmark.page.publish
      ) {
        return true
      } else {
        return false
      }
    }
  }
}
