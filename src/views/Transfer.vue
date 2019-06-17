<template>
  <div>
    <div v-if="this.authorized">Your request has been granted</div>
    <div v-if="!this.authorized">Your request has NOT been granted</div>
  </div>
</template>
<script>
import AuthorService from '@/services/AuthorService.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  props: ['countryCODE', 'languageISO', 'actionCODE'],
  mixins: [authorMixin],
  data() {
    return {
      authorized: true
    }
  },
  async created() {
    this.authorized = this.authorize('write', this.$route.params.countryCODE)
    if (this.authorized) {
      await AuthorService.prototype(this.$route.params)
    }
  }
}
</script>
