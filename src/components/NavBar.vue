<template>
  <div id="nav">
    <router-link to="/">
      <img class="nav-icon" alt="Home" src="@/assets/header1.png" />
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}
img.nav-icon {
  width: 95%;
  max-width: 650px;
}
</style>
