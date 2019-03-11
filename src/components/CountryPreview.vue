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
import ContentService from '@/services/ContentService.js'
import { mapState } from 'vuex'
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
      var ref = this
      localStorage.setItem('lastPage', 'countries')
      ContentService.getLanguages(country.code, 'latest').then(response => {
        console.log('response from getLanguages for ' + country)
        console.log(response.data) // For now, logs out the response
        console.log('length is ' + response.data.length)
        ref.languages = response.data
        if (response.data.length === 1) {
          var language = response.data[0]
          //    console.log('language is ')
          //    console.log(language)
          ref.$store
            .dispatch('updateBookmark', ['language', language])
            .then(responseUnused => {
              //        console.log('language_iso is ' + language.iso)
              ref.$router.push({
                name: 'previewLibrary',
                params: {
                  countryCODE: country.code,
                  languageISO: language.iso
                }
              })
            })
        } else {
          ref.$router.push({
            name: 'previewLanguages',
            params: { countryCODE: country.code }
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
