<template>
  <div id="nav">
    <router-link to="/">
      <img class="nav-icon" alt="Home" src="@/assets/header-admin.png">
    </router-link>
    <vue-dropdown :config="config"></vue-dropdown>

  </div>
  
</template>

<script>
import VueDropdown from 'vue-dynamic-dropdown'
export default {
  components: {
    VueDropdown
  },
  data: function() {
    return {
      config: {
        options: [
          {
            value: 'option 1'
          },
          {
            value: 'option 2'
          },
          {
            value: 'option 3'
          }
        ],
        prefix: 'The',
        backgroundColor: 'green'
      }
    }
  },
  methods: {
    goBack() {
      window.history.back()
    }
  }
}
</script>

<style>
</style>
