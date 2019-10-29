import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
import { timeout } from 'q'
Vue.use(Vuex)

export const authorMixin = {
  computed: mapState(['user']),
  methods: {
    authorize(reason, code) {
      if (typeof code == 'undefined') {
        return false
      }

      if (typeof this.user.expires == 'undefined') {
        this.$router.push({ name: 'login' })
      }
      // check if expired
      var date = new Date()
      var timestamp = date.getTime()
      if (this.user.expires < timestamp) {
        this.$router.push({ name: 'login' })
      }

      // check authority
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
        //console.log('included ' + included)
        if (reason == 'publish') {
          return included
        }
        if (reason == 'prototype') {
          return included
        }
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
