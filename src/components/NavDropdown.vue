<template>
  <div id="app">
    <p>https://github.com/JonathanDn/vue-dropdown#readme</p>
    <vue-dropdown :config="config" @setSelectedOption="setNewSelectedOption($event);"></vue-dropdown>
  </div>
</template>

<script>
import vueDropdown from './dropdown/dropdown.vue'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    vueDropdown
  },
  computed: mapState(['bookmark']),
  data: function() {
    return {
      config: {
        options: [
          {
            value: 'Countries',
            link: 'Fred'
          },
          {
            value: 'Languages'
          },
          {
            value: 'Library'
          }
        ],
        placeholder: '',
        backgroundColor: '#cde4f5',
        textColor: 'black',
        borderRadius: '1.5em',
        border: '1px solid gray',
        width: 180
      }
    }
  },
  methods: {
    setNewSelectedOption(selectedOption) {
      console.log(' I am at selectedOption')
      console.log(selectedOption)
      switch (selectedOption.value) {
        case 'Countries':
          this.$router.push({
            name: 'previewCountries'
          })
          break
        case 'Languages':
          this.$router.push({
            name: 'previewLanguages',
            params: {
              countryCODE: this.bookmark.country.code
            }
          })
          break
        case 'Library':
          this.$router.push({
            name: 'previewLibrary',
            params: {
              countryCODE: this.bookmark.country.code,
              languageISO: this.bookmark.language.iso
            }
          })
          break
        default:
          console.log('Can not find route in NaveDropdown')
        // code block
      }

      this.config.placeholder = selectedOption.value
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
