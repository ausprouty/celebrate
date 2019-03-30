export const versionLatestMixin = {
  created() {
    console.log (this.$route)
    this.$route.params.version = 'latest'
    this.$route.params.country = 'FR'
  }
}
