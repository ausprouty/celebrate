<template>
  <div class="app-link" v-on:click="newBookmark(country)">
    <div class="country-card -shadow">
      <img v-bind:src="appDir.country  + country.image" class="flag">
      <div class="country-names">
        <span class="country-name">{{country.name}}</span>
        <br/>
         <span class="country-name-english">{{country.english}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    country: Object
  },
  computed: mapState(['bookmark', 'appDir']),
  methods: {
    newBookmark: function(country) {
      console.log('New Bookmark for ')
      console.log(country)
      this.$store
        .dispatch('newBookmark', country)
        .then(() => {
          this.$router.push({
            name: 'languages',
            params: { countryCODE: country.code }
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

div.break {
  display: inline;
}

.country-card {
  cursor: pointer;
  margin-bottom: 12px;
  padding: 10px;
  text-align: left;
  transition: all 0.2s linear;
  width: 95%;
}
div.country-names {
  float: right;
  font-size: 18px;
  vertical-align: top;
  width: 70%;
}
.country-name{
  font-weight:bold;
  line-height: 20px;
}
.country-name-english{
  font-weight:normal;
  line-height: 20px;
}

img.flag {
  width: 25%;
}


</style>
