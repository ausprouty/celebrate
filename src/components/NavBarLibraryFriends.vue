<template>
  <div>
    <div v-if="!authorized">
      <div id="nav">
        <router-link to="/">
          <img class="nav-icon" alt="Home" src="/images/menu/header-hamburger.png">
        </router-link>
      </div>
    </div>
    <div v-if="authorized">
      <div v-on:click="toggleMenu()">
        <img class="nav-icon" alt="Home" src="/images/menu/header-hamburger.png">
      </div>
      <div v-if="showMenu">
        <div v-for="menuItem in this.menu" :key="menuItem.link" :menuItem="menuItem">
          <div class="menu-card -shadow" v-if="menuItem.show">
            <div
              class="float-left"
              style="cursor:pointer"
              @click="setNewSelectedOption(menuItem.link)"
            >{{ menuItem.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { authorMixin } from '@/mixins/AuthorMixin.js'
export default {
  computed: mapState(['bookmark']),
  mixins: [authorMixin],
  created() {
    this.authorized = this.authorize('read', this.$route.params.country_code)
  },
  data() {
    return {
      authorized: false,
      showMenu: false,
      menu: [
        {
          value: 'Country',
          link: 'country',
          index: 0,
          show: true
        },
        {
          value: 'Life Principles',
          link: 'principles',
          index: 1,
          show: true
        },
        {
          value: 'Basic Coversations',
          link: 'basics',
          index: 2,
          show: true
        },
        {
          value: 'First Steps',
          link: 'steps',
          index: 3,
          show: true
        },
        {
          value: 'Multiply',
          link: 'multiply',
          index: 4,
          show: true
        },
        {
          value: 'Compass',
          link: 'compass',
          index: 5,
          show: true
        }
      ]
    }
  },

  methods: {
    goBack() {
      window.history.back()
    },
    toggleMenu() {
      console.log('tried to toggle this')
      if (this.showMenu) {
        this.showMenu = false
        console.log('toggle off')
      } else {
        console.log('toggle on')
        this.showMenu = true
      }
    },
    setNewSelectedOption(selectedOption) {
      this.showMenu = false
      switch (selectedOption) {
        case 'country':
          this.$router.push({
            name: 'previewCountryPage',
            params: {
              country_code: this.$route.params.country_code
            }
          })
          break
        case 'principles':
          this.$router.push({
            name: 'previewSeries',
            params: {
              country_code: this.$route.params.country_code,
              language_iso: 'eng',
              library_code: 'friends',
              folder_name: 'principles'
            }
          })
          break
        case 'basics':
          this.$router.push({
            name: 'previewSeries',
            params: {
              country_code: this.$route.params.country_code,
              language_iso: 'eng',
              library_code: 'friends',
              folder_name: 'basics'
            }
          })
          break
        case 'steps':
          this.$router.push({
            name: 'previewSeries',
            params: {
              country_code: this.$route.params.country_code,
              language_iso: 'eng',
              library_code: 'friends',
              folder_name: 'first_steps'
            }
          })
          break
        case 'multiply':
          this.$router.push({
            name: 'previewSeries',
            params: {
              country_code: this.$route.params.country_code,
              language_iso: 'eng',
              library_code: 'friends',
              folder_name: 'multiply'
            }
          })
          break
        case 'compass':
          this.$router.push({
            name: 'previewSeries',
            params: {
              country_code: this.$route.params.country_code,
              language_iso: 'eng',
              library_code: 'friends',
              folder_name: 'compass'
            }
          })
          break
        default:
          console.log('Can not find route in NavBarCountry')
        // code block
      }
    }
  }
}
</script>

<style></style>
