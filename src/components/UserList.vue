<template>
  <div>
    <div class="user">
      <a v-bind:href="/user/ + user.uid"
        >{{ user.firstname }} {{ user.lastname }}</a
      >
      -- {{ this.scope }}
    </div>
  </div>
</template>

<script>
import { countriesMixin } from '@/mixins/CountriesMixin.js'
import { bookMarkMixin } from '@/mixins/BookmarkMixin.js'
export default {
  props: {
    user: Object
  },
  mixins: [bookMarkMixin, countriesMixin],
  data: function() {
    return {
      scope: null
    }
  },
  async created() {
    console.log(this.user.countries)
    if (!this.user.countries) {
      this.scope = ''
    } else if (this.user.countries == '*') {
      this.scope = 'Global'
    } else {
      await this.getCountries()
      console.log('countries')
      console.log(this.countries)
      var country_count = this.countries.length
      var c = 0
      this.scope = ''
      var user_scope = this.user.countries.split('|')
      var length = user_scope.length
      console.log(length)
      for (var i = 0; i < length; i++) {
        for (c = 0; c < country_count; c++) {
          if (this.countries[c].code == user_scope[i]) {
            this.scope = this.scope + this.countries[c].english + '  '
          }
        }
      }
    }
  }
}
</script>
<style scoped>
div.user {
  width: 50%;
  height: 1.5 em;
}
div.countries {
  width: 50%;
  float: left;
}
</style>
