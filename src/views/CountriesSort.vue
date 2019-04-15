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
        <button class="button red" @click="saveForm">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBarAdmin.vue'
import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
import { countriesMixin } from '@/mixins/CountriesMixin.js'
export default {
  mixins: [bookMarkMixin, countriesMixin],
  components: {
    NavBar,
    draggable
  },
  computed: mapState(['bookmark', 'appDir', 'revision']),

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
      try {
        this.$store.dispatch('newBookmark', 'clear')
        var valid = ContentService.valid(this.countries)
        this.content.text = JSON.stringify(valid)
        this.content.filename = 'countries'
        this.content.filetype = 'json'
        await AuthorService.createContentData(this.content)
        this.$router.push({
          name: 'previewCountries'
        })
      } catch (error) {
        console.log('COUNTRIES SORT There was an error ', error) //
      }
    },

    beforeCreate() {
      this.$route.params.version = 'latest'
    }
  },
  async created() {
    try {
      await this.getCountries()
    } catch (error) {
      console.log('There was an error in Countries.vue:', error) // Logs out the error
    }
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
