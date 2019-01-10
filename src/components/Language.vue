<template>
  <router-link class="event-link" :to="{ name: 'library', params: { folder: language.folder }}">
    <div class="event-card -shadow">
      <div class="language">
        <span class="bold">{{language.name}}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    language: Object
  }
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
