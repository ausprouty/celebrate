<template>
  <div>
    <div v-if="!authorized">
      <div id="nav">
        <router-link to="/">
          <img class="nav-icon" alt="Home" src="@/assets/header-hamburger.png">
        </router-link>
      </div>
    </div>
    <div v-if="authorized">
      <div v-on:click="toggleMenu()">
        <img class="nav-icon" alt="Home" src="@/assets/header-hamburger.png">
      </div>
      <div v-if="showMenu">
        <div v-for="(menuItem) in this.menu" :key="menuItem.link" :menuItem="menuItem">
          <div class="menu-card -shadow" v-if="menuItem.show">
            <div
              class="float-left"
              style="cursor:pointer"
              @click="setNewSelectedOption(menuItem.link)"
            >{{menuItem.value}}</div>
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
    this.authorized = this.authorize('read', this.$route.params.countryCODE)
  },
  data() {
    return {
      authorized: false,
      showMenu: false,
      menu: [
        {
          value: 'Edit this page',
          link: 'page',
          index: 0,
          show: true
        },
        {
          value: 'Preview Latest Countries',
          link: 'countries',
          index: 1,
          show: true
        },
        {
          value: 'Preview Latest Languages',
          link: 'languages',
          index: 2,
          show: false
        },
        {
          value: 'Edit Latest Library',
          link: 'library',
          index: 3,
          show: false
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
        case 'page':
          console.log('this route')
          console.log(this.$route)
          this.$router.push({
            path: '/edit/' + this.$route.path
          })
          break
        case 'countries':
          this.$router.push({
            name: 'previewCountries'
          })
          break
        case 'languages':
          this.$router.push({
            name: 'previewLanguages',
            params: {
              countryCODE: this.bookmark.country.code
            }
          })
          break
        case 'library':
          this.$router.push({
            name: 'previewLibrary',
            params: {
              countryCODE: this.bookmark.country.code,
              languageISO: this.bookmark.language.iso
            }
          })
          break
        default:
          console.log('Can not find route in NavBarAdmin')
        // code block
      }
    }
  }
}
</script>


<style>
</style>
