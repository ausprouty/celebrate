<template>
  <div class="app-link" v-on:click="showLanguagePage(country)">
    <div
      class="shadow-card -shadow"
      v-bind:class="{ notpublished: !country.publish, custom: country.custom }"
    >
      <img v-bind:src="appDir.country + country.image" class="flag" />
      <div class="card-names">
        <span class="card-name">{{ country.name }}</span>
        <br />
        <span class="card-name-english">{{ country.english }}</span>
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
      console.log('country')
      console.log(country)
      console.log(country.code)
      localStorage.setItem('lastPage', 'countries')
      this.$route.params.countryCODE = country.code
      var route = 'previewLanguages'
      if (country.custom) {
        route = 'previewCountryPage'
      }
      this.$router.push({
        name: route,
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

.custom {
  background-color: green;
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
