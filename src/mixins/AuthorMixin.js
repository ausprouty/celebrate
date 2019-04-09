import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
Vue.use(Vuex)

export const authorMixin = {
  computed: mapState(['user'),
  methods: {
    authorize(reason) {
      var scope = this.user.scope
      if (scope == '*') {
        return true
      } else {
        if (reason == 'edit') {
          var show = scope.includes(this.$route.params.countryCODE)
          return show
        }
        if (reason == 'read' && scope) {
          return true
        }
      }
    }
  }
}
