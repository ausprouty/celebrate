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
    mayPublishSeies() {
      if (!this.authorize('publish', this.$route.params.country_code)) {
        return false
      }
      if (
        this.bookmark.country.publish &&
        this.bookmark.language.publish &&
        this.bookmark.series.publish
      ) {
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
        this.bookmark.series.publish &&
        this.bookmark.page.publish
      ) {
        return true
      } else {
        return false
      }
    }
  }
}
