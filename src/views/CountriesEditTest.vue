<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error... {{this.error_message}}</div>
    <div class="content" v-if="loaded">
      <h1>Countries</h1>
      <p>from https://vuelidate.netlify.com/#sub-validation-groups</p>
      <div>
        <div
          v-for="(country, index) in $v.countries.$each.$iter"
          :key="country.code"
          :country="country"
        >
          <BaseInput
            v-model="country.english.$model"
            label="English Name"
            type="text"
            placeholder="English Name"
            class="field"
            :class="{ error: country.english.$error }"
            @blur="country.english.$touch()"
          />
          <template v-if="country.english.$error">
            <div class="errorMessage" v-if="!country.english.required">English Name is required.</div>
          </template>
        </div>
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
import { authorMixin } from '@/mixins/AuthorsMixin.js'
import { required } from 'vuelidate/lib/validators'
export default {
  mixins: [bookMarkMixin, countriesMixin, authorMixin],
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir', 'revision']),
  data() {
    return {
      countries: {
        name: '',
        english: '',
        code: '',
        index: '',
        image: ''
      }
    }
  },
  validations: {
    countries: {
      required,
      $each: {
        name: { required },
        english: { required },
        code: { required },
        index: { required },
        image: { required }
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
    async saveForm() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          this.$store.dispatch('newBookmark', 'clear')
          var valid = ContentService.validate(this.countries)
          this.content.text = JSON.stringify(valid)
          this.content.filename = 'countries'
          this.content.filetype = 'json'
          valid = await AuthorService.createContentData(this.content)
          this.$router.push({
            name: 'previewCountries'
          })
        } catch (error) {
          console.log('COUNTRIES EDIT There was an error ', error)
          this.error = true
          this.loaded = false
          this.error_message = valid.data.message
        }
      }
    }
  },
  beforeCreate() {
    this.$route.params.version = 'latest'
  },
  async created() {
    try {
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
