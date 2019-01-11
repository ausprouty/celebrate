<template>
  <router-link
    class="event-link"
    :to="{ name: 'library', params: { country: bookmark.country, folder: language.folder }}"
  >
    <div class="event-card -shadow">
      <div class="language">
        <span class="bold">{{language.name}}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    language: Object
  },
  computed: mapState(['bookmark'])
}
</script>

<style scoped>
div.language {
  width: 100%;
  font-size: 24px;
}
.language {
  text-align: left;
}

.bold {
  font-weight: bold;
}
</style>
