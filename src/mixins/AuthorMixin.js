import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
Vue.use(Vuex)

export const authorMixin = {
  computed: mapState(['user']),
  methods: {
    authorize(reason, code) {
      if (typeof code == 'undefined') {
        return false
      }
      var scope = this.user.scope
      if (scope == '*') {
        if (reason != 'readonly') {
          return true
        } else {
          return false
        }
      } else {
        var included = false
        included = scope.includes(code)
        console.log('included ' + included)
        if (reason == 'write') {
          return included
        }
        if (reason == 'read' && scope) {
          return true
        }
        if (reason == 'readonly' && scope && !included) {
          return true
        }
      }
      return false
    }
  }
}
