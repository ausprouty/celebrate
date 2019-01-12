import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    imgDir: {
      library: '/img/libary/menu-europe/',
      country: '/img/country/',
      icon: '/img/icon/'
    },
    bookmark: {
      country: '',
      language: '',
      library: '',
      book: '',
      page: ''
    }
  },
  mutations: {
    NEW_BOOKMARK(state, country) {
      console.log(country)
      state.bookmark = {}
      state.bookmark.country = country
    },
    UPDATE_BOOKMARK(state, bookmark) {
      console.log(bookmark)
      state.bookmark = bookmark
    }
  },
  actions: {
    newBookmark({ commit }, country) {
      commit('NEW_BOOKMARK', country)
    },
    updateBookmark({ commit }, bookmark) {
      commit('UPDATE_BOOKMARK', bookmark)
    }
  }
})
