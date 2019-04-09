<template>
  <div id="nav">
    <div v-if="!authorized">
      <router-link to="/">
        <img class="nav-icon" alt="Home" src="@/assets/header-hamburger.png">
      </router-link>
    </div>
    <div v-if="authorized">
      <div v-on:click="toggleMenu()">
        <img class="nav-icon" alt="Home" src="@/assets/header-admin.png">
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
  data() {
    return {
      showMenu: false,
      authorized: false,
      menu: [
        {
          value: 'Edit Countries',
          link: 'countries',
          index: 1,
          show: true
        },
        {
          value: 'Edit Languages',
          link: 'languages',
          index: 2,
          show: false
        },
        {
          value: 'Edit Library',
          link: 'library',
          index: 3,
          show: false
        }
      ]
    }
  },
  created() {
    this.authorized = this.authorize('read')
    if (this.bookmark.country.code) {
      this.menu[1].show = true
    }
    if (this.bookmark.language.iso && this.bookmark.country.code) {
      this.menu[2].show = true
    }
  },
  methods: {
    goBack() {
      window.history.back()
    },
    toggleMenu() {
      console.log('tried to toggle')
      if (this.showMenu) {
        this.showMenu = false
      } else {
        this.showMenu = true
      }
    },
    setNewSelectedOption(selectedOption) {
      switch (selectedOption) {
        case 'countries':
          this.$router.push({
            name: 'editCountries'
          })
          break
        case 'languages':
          this.$router.push({
            name: 'editLanguages',
            params: {
              countryCODE: this.bookmark.country.code
            }
          })
          break
        case 'library':
          this.$router.push({
            name: 'editLibrary',
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
