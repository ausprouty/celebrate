export const versionLatestkMixin = {
  created() {
    this.$route.params.version = 'current'
  }
}