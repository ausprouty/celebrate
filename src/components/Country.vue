<template>
  <div class="app-link" v-on:click="showPage(country)">
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
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
export default {
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
    showPage: function(country) {
      this.$route.params.countryCODE = country.code
      localStorage.setItem('lastPage', 'countries')
      ContentService.getLanguages(this.$route.params).then(response => {
        console.log(
          'COUNTRY VIEW - response from getLanguages for ' + country.code
        )
        console.log(response.data) // For now, logs out the response
        console.log('COUNTRY VIEW - length is ' + response.data.length)
        this.languages = response.data
        if (response.data.length === 1) {
          var language = response.data[0]
          //    console.log('COUNTRY VIEW - language is ')
          //    console.log(language)
          this.$router.push({
            name: 'library',
            params: {
              countryCODE: this.$route.params.countryCODE,
              languageISO: language
            }
          })
        } else {
          this.$router.push({
            name: 'languages',
            params: { countryCODE: this.$route.params.countryCODE }
          })
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
