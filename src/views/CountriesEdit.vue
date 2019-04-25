<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{this.error_message}}</div>
    <div class="content" v-if="loaded">
      <h1>Countries</h1>
      <div
        v-for="(country, index) in $v.countries.$each.$iter"
        :key="country.code.$model"
        :country="country"
      >
        <div class="app-card -shadow">
          <div class="float-right" style="cursor:pointer" @click="deleteCountryForm(index)">X</div>
          <form>
            <BaseInput
              v-model="country.name.$model"
              label="Country Name"
              type="text"
              placeholder="Country Name"
              class="field"
              :class="{ error: country.name.$error }"
              @blur="country.name.$touch()"
            />
            <template v-if="country.name.$error">
              <div class="errorMessage" v-if="!country.name.required">Country Name is required.</div>
            </template>

            <BaseInput
              v-model="country.english.$model"
              label="English Name"
              type="text"
              placeholder="English Name"
              class="field"
            />

            <BaseInput
              v-model="country.code.$model"
              label="Country ISO Code"
              type="text"
              placeholder="2 letter ISO code"
              class="field"
              :class="{ error: country.code.$error }"
              @blur="country.code.$touch()"
              @input="forceUpperCODE(country.code.$model)"
            />
            <div v-if="!country.code.$model">
              <p>
                <a
                  target="a_blank"
                  href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes"
                >Reference File</a>
              </p>
            </div>
            <template v-if="country.code.$error">
              <div class="errorMessage" v-if="!country.code.required">Country Code is required.</div>
            </template>

            <div v-if="!country.image.$model">
              <p class="errorMessage">Upload Country Flag</p>
            </div>

            <div v-if="country.image.$model">
              <br>
              <img v-bind:src="appDir.country+ country.image.$model" class="flag">
              <br>
            </div>
            <div v-if="country.code.$model">
              <label>
                <input
                  type="file"
                  v-bind:id="country.code.$model"
                  ref="file"
                  v-on:change="handleFileUpload(country.code.$model)"
                >
              </label>
            </div>
          </form>
        </div>
      </div>
      <div v-if="this.authorized">
        <div>
          <button class="button" @click="addNewCountryForm">New Country</button>
        </div>
        <div v-if="!$v.$anyError">
          <button class="button red" @click="saveForm">Save Changes</button>
        </div>
        <div v-if="$v.$anyError">
          <button class="button grey">Disabled</button>
          <p v-if="$v.$anyError" class="errorMessage">Please fill out the required field(s).</p>
        </div>
      </div>
      <div v-if="!this.authorized">
        <p>
          You need to
          <a href="/login">login to make changes</a> here
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { countriesMixin } from '@/mixins/CountriesMixin.js'
import { authorMixin } from '@/mixins/AuthorMixin.js'
import { required } from 'vuelidate/lib/validators'
export default {
  mixins: [bookMarkMixin, countriesMixin, authorMixin],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'revision']),
  data() {
    return {
      file: null,
      error_message: null,
      countries: {
        name: null,
        english: null,
        code: null,
        index: null,
        image: null
      },
      authorized: false
    }
  },
  validations: {
    countries: {
      required,
      $each: {
        name: { required },
        english: {},
        code: { required },
        index: {},
        image: {}
      }
    }
  },
  methods: {
    deleteCountryForm(index) {
      this.countries.splice(index, 1)
    },
    addNewCountryForm() {
      this.countries.push({
        name: null,
        english: null,
        code: null,
        index: null,
        image: null
      })
    },
    forceUpperCODE(value) {
      var change = this.$v.countries.$model
      var arrayLength = change.length
      for (var i = 0; i < arrayLength; i++) {
        var checkfile = this.$v.countries.$model[i]
        if (checkfile.code == value) {
          this.$v.countries.$each[i].$model.code = value.toUpperCase()
        }
      }
    },
    handleFileUpload(code) {
      console.log('code in handle:' + code)
      var checkfile = ''
      var i = 0
      var arrayLength = this.$refs.file.length
      for (i = 0; i < arrayLength; i++) {
        checkfile = this.$refs.file[i]['files']
        if (checkfile.length == 1) {
          // console.log(checkfile)
          //  console.log(checkfile[0])
          var type = AuthorService.typeImage(checkfile[0])
          if (type) {
            var params = {}
            params.directory = 'flag'
            params.name = code
            AuthorService.storeImage(params, checkfile[0])

            for (i = 0; i < arrayLength; i++) {
              checkfile = this.$v.countries.$each[i]
              if (checkfile.code.$model == code) {
                this.$v.countries.$each[i].$model.image = 'default.png'
                this.$v.countries.$each[i].$model.image = code + type
                console.log(' I reset ' + i)
                console.log(this.$v.countries.$each)
              }
            }
          }
        }
      }
    },
    async saveForm() {
      // this.$v.$touch()
      // if (!this.$v.$invalid) {
      try {
        console.log('saving form')
        this.$store.dispatch('newBookmark', 'clear')
        var valid = ContentService.validate(this.countries)
        AuthorService.setupCountries(this.countries)
        this.content.text = JSON.stringify(valid)
        this.content.filename = 'countries'
        this.content.filetype = 'json'
        valid = await AuthorService.createContentData(this.content)
        if (valid.data.error != 'false') {
          this.$router.push({
            name: 'previewCountries'
          })
        }
      } catch (error) {
        console.log('COUNTRIES EDIT There was an error ', error)
        this.error = true
        this.loaded = false
        this.error_message = error
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
      this.authorized = this.authorize('write')
      await this.getCountries()
    } catch (error) {
      console.log('There was an error in CountriesEdit.vue:', error) // Logs out the error
    }
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
