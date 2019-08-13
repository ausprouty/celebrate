<template>
  <div>
    <h1> {{this.passage_name}} </h1>
     <span v-html="this.bible"></span><br/></br>
    Link:     {{ this.link }}
  </div>
</template>
<script>
import AuthorService from '@/services/AuthorService.js'
import BibleService from '@/services/BibleService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  mixins: [authorMixin, bookMarkMixin],
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  data() {
    return {
      authorized: true,
      link: null,
      passage_name: null,
      bible: null
    }
  },
  async created() {
    this.authorized = this.authorize('write', 'countries')
    if (this.authorized) {
      var params = {}
      params.entry = 'John 3:16-18'
      params.language_iso = 'eng'
      params.dbt = await BibleService.getDbtArray(params)
      console.log(params)
      params.bid = 1234
      var response = await BibleService.getBiblePassage(params)
      console.log(response)
      this.link = response.data.link
      this.bible = response.data.bible
      this.passage_name = response.data.passage_name
    }
  }
}
</script>
