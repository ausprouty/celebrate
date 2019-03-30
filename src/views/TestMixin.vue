<template>
  <div>This is my text</div>
</template>
<script>
import { mapState } from 'vuex'
import { versionLatestMixin } from '@/mixins/VersionLatestMixin.js'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import NavBar from '@/components/NavBarBack.vue'
export default {
  mixins: [versionLatestMixin, bookMarkMixin],
  props: ['countryCODE', 'languageISO', 'folderNAME', 'fileFILENAME'],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'cssURL', 'standard']),
  async created() {
    this.$route.params.countryCODE = 'AU'
    await this.CheckBookmarks(this.$route.params)
    console.log('Done with create')
    console.log(this.bookmark)
  }
}
</script>
