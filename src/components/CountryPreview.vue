<template>
  <div class="app-link" v-on:click="showLanguagePage(country)">
    <div class="shadow-card -shadow">
      <img v-bind:src="appDir.country+ country.image" class="flag">
      <div class="card-names">
        <span class="card-name">{{country.name}}</span>
        <br>
        <span class="card-name-english">{{country.english}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ContentService from '@/services/ContentService.js'
import { mapState } from 'vuex'
import { countriesMixin } from '@/mixins/CountriesMixin.js'

export default {
  mixins: [countriesMixin],
  props: {
    country: Object
  },
  data: function() {
    return {
      saving: false,
      bMark: this.$store.state.bookmark
    }
  },
  computed: mapState(['bookmark', 'appDir']),
  methods: {
    showLanguagePage(country) {
      localStorage.setItem('lastPage', 'countries')
      this.$route.params.countryCODE = country.code
      this.$router.push({
        name: 'previewLanguages',
        params: {
          countryCODE: country.code
        }
      })
    }
  }
}
</script>

<style scoped>
div.break {
  display: inline;
}

.shadow-card {
  background-color: #efefef;
  cursor: pointer;
  margin-bottom: 12px;
  padding: 10px;
  text-align: left;
  transition: all 0.2s linear;
  width: 95%;
}
div.card-names {
  float: right;
  font-size: 18px;
  vertical-align: top;
  width: 70%;
}
.card-name {
  font-weight: bold;
  line-height: 20px;
}
.card-name-english {
  font-weight: normal;
  line-height: 20px;
}

img.flag {
  width: 25%;
}
</style>
