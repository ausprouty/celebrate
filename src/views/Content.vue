<template>
  <div>{{ this.page }}</div>
</template>
<script>
export default {
  props: ['country_code', 'language_iso', 'folder_name', 'filename'],
  data() {
    return {
      page: ''
    }
  },

  async created() {
    try {
      await this.CheckBookmarks(this.$route.params)
      var response = await ContentService.getContent(this.$route.params)
      this.countries = response.data.content.text
    } catch (error) {
      console.log('There was an error in Countries.vue:', error) // Logs out the error
    }
  }
}
</script>

<style></style>
