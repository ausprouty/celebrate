<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Countries</h1>
      <div>
        <draggable v-model="countries">
          <transition-group>
            <div v-for="country in countries" :key="country.code">
              <div class="shadow-card -shadow">
                <img v-bind:src="appDir.icons +'move2red.png' " class="sortable">
                <span class="card-name">{{country.name}}</span>
              </div>
            </div>
          </transition-group>
        </draggable>
        <button class="button" @click="saveForm">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
export default {
  components: {
    NavBar,
    draggable
  },
  computed: mapState(['bookmark', 'appDir', 'revision']),
  data() {
    return {
      countries: [
        {
          code: '',
          english: '',
          name: '',
          index: ''
        }
      ],
      loading: false,
      loaded: null,
      error: null,
      content: {
        recnum: '',
        version: '',
        edit_date: '',
        edit_uid: '',
        publish_uid: '',
        publish_date: '',
        language_iso: '',
        country_iso: '',
        folder: '',
        filetype: '',
        title: '',
        filename: '',
        text: ''
      }
    }
  },
  methods: {
    deleteCountryForm(index) {
      this.countries.splice(index, 1)
    },
    addNewCountryForm() {
      this.countries.push({
        code: '',
        english: '',
        name: '',
        index: ''
      })
    },
    saveForm() {
      console.log(this.content)
      this.content.text = JSON.stringify(this.countries)
      this.content.filename = 'countries'
      this.content.filetype = 'json'
      var contentForm = this.toFormData(this.content)
      var ref = this
      ContentService.createContentData(contentForm).then(function(response) {
        if (response.data.error) {
          ref.errorMessage = response.data.message
        } else {
          // this.successMessage = response.data.message
          //ref.getCountries()
          ref.$router.push({
            name: 'previewCountries'
          })
        }
      })
    },
    toFormData(obj) {
      this.content.edit_date = ''
      this.content.edit_uid = ''
      var form_data = new FormData()
      for (var key in obj) {
        form_data.append(key, obj[key])
      }
      this.content.text = ''
      console.log('form_data')
      // Display the key/value pairs
      for (var pair of form_data.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }
      return form_data
    },

    getCountries() {
      this.error = this.loaded = null
      this.loading = true
      this.countries = []
      var ref = this
      console.log('about to get countries ')
      ContentService.getCountries(this.revision)
        .then(response => {
          console.log('response')
          console.log(response.data)
          if (response.data.content == 'none') {
            ContentService.getCountries().then(response => {
              console.log('lookig for old data')
              ref.countries = response.data
              ref.loaded = true
              ref.loading = false
            })
          } else {
            ref.content.recnum = ''
            ref.content.version = ''
            ref.content.publish_uid = response.data.content.publish_uid
            ref.content.publish_date = response.data.content.publish_date
            ref.content.language_iso = ''
            ref.content.country_iso = ''
            ref.content.folder = ''
            ref.content.filetype = 'json'
            ref.content.title = ''
            ref.content.filename = 'countries'
            ref.content.countries = JSON.parse(response.data.content.text)
            ref.loaded = true
            ref.loading = false
            this.countries = ref.content.countries
            console.log(ref.content.countries)
          }
        })
        .catch(() => {
          console.log('There was a problem finding countries in ')
        })
    }
  },
  created() {
    this.getCountries()
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
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
</style>
