<template>
  <div id="nav">
    <div v-on:click="toggleMenu()">
      <img class="nav-icon" alt="Home" src="/images/menu/header-admin.png" />
    </div>
    <div v-if="showMenu">
      <div
        v-for="menuItem in this.menu"
        :key="menuItem.link"
        :menuItem="menuItem"
      >
        <div class="menu-card -shadow" v-if="menuItem.show">
          <div
            class="float-left"
            style="cursor:pointer"
            @click="setNewSelectedOption(menuItem.link)"
          >
            {{ menuItem.value }}
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
  computed: mapState(['bookmark', 'user']),
  mixins: [authorMixin],
  data() {
    return {
      showMenu: false,
      authorized: false,
      administrator: false,
      menu: [
        {
          value: 'Login',
          link: 'login',
          index: 0,
          show: false
        },
        {
          value: 'Preview Latest Countries',
          link: 'countries',
          index: 1,
          show: false
        },
        {
          value: 'Preview Latest Languages',
          link: 'languages',
          index: 2,
          show: false
        },
        {
          value: 'Preview Latest Library',
          link: 'library',
          index: 3,
          show: false
        },
        {
          value: 'Register Editor',
          link: 'register',
          index: 4,
          show: false
        },
        {
          value: 'Logout',
          link: 'logout',
          index: 5,
          show: false
        }
      ]
    }
  },
  created() {
    var scope = 'world'
    if (this.$route.params.countryCODE) {
      scope = this.$route.params.countryCODE
    }
    this.authorized = this.authorize('read', scope)
    this.administrator = this.authorize('register', scope)
    var arrayLength = this.menu
    for (var i = 0; i < arrayLength; i++) {
      this.menu[i].show = false
    }
    if (this.authorized) {
      this.menu[1].show = true
      if (this.bookmark.country.code) {
        this.menu[2].show = true
      }
      if (this.bookmark.language.iso && this.bookmark.country.code) {
        this.menu[3].show = true
      }
      this.menu[5].show = true
    }
    if (this.administrator) {
      this.menu[4].show = true
    }
    if (!this.authorized) {
      this.menu[0].show = true
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
        case 'login':
          this.$router.push({
            name: 'login'
          })
          break
        case 'logout':
          this.user = null
          this.$router.push({
            name: 'login'
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
              countryCODE: this.$route.params.countryCODE,
              languageISO: this.$route.params.languageISO,
              libraryCODE: this.$route.params.libraryCODE
            }
          })
          break
        case 'register':
          this.$router.push({
            name: 'farm'
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

<style></style>
