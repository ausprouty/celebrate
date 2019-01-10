<template>
  <router-link class="event-link" :to="{ name: 'language', params: { country: country.code } }">
    <div class="event-card -shadow">
      <img v-bind:src="country.image" class="flag">
      <div class="country">
        <span class="bold">{{country.name}}</span>
        <br>
        {{country.english}}
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    country: Object
  }
}
</script>

<style scoped>
img.flag {
  width: 25%;
}
div.country {
  vertical-align: top;
  width: 70%;
  font-size: 24px;
  float: right;
}
.country {
  text-align: left;
}
div.break {
  display: inline;
}
.bold {
  font-weight: bold;
}
</style>
