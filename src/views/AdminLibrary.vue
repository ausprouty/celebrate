<template>
  <div>
    <NavBar/>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-if="error">There was an error...</div>
    <div class="content" v-if="loaded">
      <h1>Library</h1>
      <div>

        <div v-for="(country, index) in countries" :key="country.code" :country="country">
          <div class="app-card -shadow">
            <div class="float-right" style="cursor:pointer" @click="deleteCountryForm(index)">X</div>
            <h4 class="card-title">Country #{{index}}</h4>
            <div class="form">
              <span>Country Name :</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Country Name"
                v-model="country.name"
              >
              <span>English Name:</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="English Name"
                v-model="country.english"
              >
              <span>country 2 letter ISO:</span>
              <input
                type="text"
                maxlength="2"
                class="form-control mb-2"
                placeholder="2 letter ISO code"
                v-model="country.code"
              >
              <span>Index</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="index-ISO"
                v-model="country.english"
              >
              <span>Image</span>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="ISO.png"
                v-model="country.image"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import DataService from '@/services/DataService.js'
//import Route from '../router.js'
import { mapState } from 'vuex'
export default {
  components: {
    NavBar
  },
  computed: mapState(['bookmark', 'appDir']),
  data() {
    return {
      library: [
        {
          id: '',
          book: '',
          title: '',
          folder: '',
          index: '',
          style: 'AU-myfriends.css',
          image: 'issues.jpg',
          format: 'series',
          instructions: ''
        }
      ],
      loading: false,
      loaded: null,
      error: null
    }
  },
 
  created() {
    /* Update bookmark based on this route (for people to select URL frcountriesom another source)
       Bookmark stores current Country and all specialized info for that country
      If there is only one country for this country we then go back to country
    */
    this.error = this.loaded = null
    this.loading = true
    this.countries = []
    console.log('about to get countries ')
    DataService.getLibrary()
      .then(response => {
        console.log('response data')
        console.log(response.data)
        this.countries = response.data
        this.loaded = true
        this.loading = false
      })
      .catch(() => {
        console.log('There was a problem finding countries')
      })
  }
}
</script>


<style scoped>
.float-right {
  text-align: right;
}
</style>
