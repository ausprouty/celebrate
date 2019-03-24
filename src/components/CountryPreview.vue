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
      ContentService.getLanguages(country.code, 'latest').then(res => {
        console.log(
          'COUNTRY PREVIEW - response from getLanguages for ' + country.code
        )
        console.log(res) // For now, logs out the response

        var response = JSON.parse(res.data.content.text)
        console.log('COUNTRY PREVIEW - response after parse')
        console.log(response)
        console.log('COUNTRY PREVIEW - length is ' + response.length)
        if (response.length === 1) {
          var language = response[0]
          //     console.log('COUNTRY PREVIEW - language is ')
          //    console.log(language)
          ref.$store
            .dispatch('updateBookmark', ['language', language])
            .then(responseUnused => {
              //         console.log('COUNTRY PREVIEW - language_iso is ' + language.iso)
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
