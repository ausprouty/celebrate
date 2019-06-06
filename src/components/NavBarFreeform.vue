<template>
  <div>
    <div v-if="!authorized">
      <div id="nav">
        <router-link to="/">
          <img
            class="nav-icon"
            alt="Home"
            src="/images/menu/header-hamburger.png"
          />
        </router-link>
      </div>
    </div>
    <div v-if="authorized">
      <div v-on:click="toggleMenu()">
        <img
          class="nav-icon"
          alt="Home"
          src="/images/menu/header-hamburger.png"
        />
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
          value: 'Country',
          link: 'country',
          index: 0,
          show: true
        },
        {
          value: 'Meet Jesus',
          link: 'meet',
          index: 1,
          show: true
        },
        {
          value: 'With Friends',
          link: 'friends',
          index: 2,
          show: true
        },
        {
          value: 'Principles',
          link: 'principles',
          index: 3,
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
              countryCODE: this.$route.params.countryCODE
            }
          })
          break
        case 'meet':
          this.$router.push({
            name: 'previewLibraryMeet',
            params: {
              countryCODE: this.$route.params.countryCODE
            }
          })
          break
        case 'friends':
          this.$router.push({
            name: 'previewLibraryFriends',
            params: {
              countryCODE: this.$route.params.countryCODE
            }
          })
          break
        case 'principles':
          this.$router.push({
            name: 'previewLibraryFriends',
            params: {
              countryCODE: this.$route.params.countryCODE
            }
          })
          break
        default:
          console.log('Can not find route in NavBarFreeform')
        // code block
      }
    }
  }
}
</script>

<style></style>
