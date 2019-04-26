import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
Vue.use(Vuex)

export const authorMixin = {
  computed: mapState(['user']),
  methods: {
    authorize(reason, code) {
      var scope = this.user.scope
      //   console.log (scope)
      if (scope == '*') {
        if (reason != 'readonly') {
          return true
        } else {
          return false
        }
      } else {
        var included = false
        included = scope.includes(code)
        if (reason == 'edit') {
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
