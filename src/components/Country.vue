<template>
  <div class="event-link" v-on:click="newBookmark(country)">
    <div class="event-card -shadow">
      <img v-bind:src="country.image" class="flag">
      <div class="country">
        <span class="bold">{{country.name}}</span>
        <br>
        {{country.english}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    country: Object
  },
  methods: {
    newBookmark: function(country) {
      console.log('New Bookmark')
      console.log(country.code)
      this.$store
        .dispatch('newBookmark', country)
        .then(() => {
          this.$router.push({
            name: 'languages',
            params: { country: country.code }
          })
        })
        .catch(() => {
          console.log('There was a problem storing country')
        })
    }
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
