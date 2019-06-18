<template>
  <div>
    <div v-if="this.authorized">Your request has been granted</div>
    <div v-if="!this.authorized">Your request has NOT been granted</div>
  </div>
</template>
<script>
import AuthorService from '@/services/AuthorService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  props: ['countryCODE', 'languageISO', 'actionCODE'],
  mixins: [authorMixin, bookMarkMixin],
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  data() {
    return {
      authorized: true
    }
  },
  async created() {
    this.authorized = this.authorize('write', this.$route.params.countryCODE)
    if (this.authorized) {
      await this.CheckBookmarks(this.$route.params)
      this.$route.params.bookmark = JSON.stringify(this.bookmark)
      console.log(this.$route.params)
      await AuthorService.prototype(this.$route.params)
    }
  }
}
</script>
