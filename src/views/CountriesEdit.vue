<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Countries</h1>
      <div
        v-for="(country, index) in $v.countries.$each.$iter"
        :key="country.code"
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
            />
            <template v-if="country.code.$error">
              <div class="errorMessage" v-if="!country.code.required">Country Code is required.</div>
            </template>

            <BaseInput
              v-model="country.index.$model"
              label="Index"
              type="text"
              placeholder="XX-index"
              class="field"
              :class="{ error: country.index.$error }"
              @blur="country.index.$touch()"
            />
            <template v-if="country.index.$error">
              <div class="errorMessage" v-if="!country.index.required">Index is required.</div>
            </template>

            <BaseInput
              v-model="country.image.$model"
              label="Index"
              type="text"
              placeholder="ISO.png"
              class="field"
              :class="{ error: country.image.$error }"
              @blur="country.image.$touch()"
            />
            <template v-if="country.image.$error">
              <div class="errorMessage" v-if="!country.image.required">Image is required.</div>
            </template>
          </form>
        </div>
      </div>
       <div>
        <button class="button" @click="addNewCountryForm">New Country</button>
      </div>
       <div v-if="!$v.$anyError">
        <button class="button red" @click="saveForm">Save Changes</button>
        </div>
        <div v-if="$v.$anyError">
        <button class="button grey" >Disabled</button>
          <p v-if="$v.$anyError" class="errorMessage">Please fill out the required field(s).</p>
        </div> 

       </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { countriesMixin } from '@/mixins/CountriesMixin.js'
import { required } from 'vuelidate/lib/validators'
export default {
  mixins: [bookMarkMixin, countriesMixin],
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
        english: {},
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
      // this.$v.$touch()
      // if (!this.$v.$invalid) {
      try {
        console.log('saving form')
        this.$store.dispatch('newBookmark', 'clear')
        var valid = ContentService.validate(this.countries)
        this.content.text = JSON.stringify(valid)
        this.content.filename = 'countries'
        this.content.filetype = 'json'
        await ContentService.createContentData(this.content)
        this.$router.push({
          name: 'previewCountries'
        })
      } catch (error) {
        console.log('COUNTRIES EDIT There was an error ', error) //
      }
    }
    //}
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
