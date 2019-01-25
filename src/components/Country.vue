<template>
  <div class="app-link" v-on:click="showPage(country)">
    <div class="country-card -shadow">
      <img v-bind:src="appDir.country+ country.image" class="flag">
      <div class="country-names">
        <span class="country-name">{{country.name}}</span>
        <br>
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
    showPage: function(country) {
      localStorage.setItem('lastPage', 'countries')
      this.$router.push({
        name: 'languages',
        params: { countryCODE: country.code }
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
  background-color: #efefef;
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
.country-name {
  font-weight: bold;
  line-height: 20px;
}
.country-name-english {
  font-weight: normal;
  line-height: 20px;
}

img.flag {
  width: 25%;
}
</style>
