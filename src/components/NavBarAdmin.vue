<template>
  <div id="nav">
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
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState(['bookmark']),
  data: function() {
    return {
      showMenu: false,
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
    console.log('NAV this.menu')
    console.log(this.menu)
    if (this.bookmark.country) {
      this.menu[1].show = true
      console.log('Country set')
    }
    if (this.bookmark.language && this.bookmark.country) {
      console.log('Language set')
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
      console.log(' I am at selectedOption')
      console.log(selectedOption)
      switch (selectedOption) {
        case 'countries':
          console.log(' I am at countries Option')
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
  }
}
</script>

<style>
</style>
