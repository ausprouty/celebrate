import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    imgDir: {
       library:'/img/libary/menu-europe/',
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
    SET_BOOKMARK(state, bookmark) {
      console.log(bookmark)
      state.bookmark = bookmark
    }
  },
  actions: {
    setBookmark({ commit }, bookmark) {
      commit('SET_BOOKMARK', bookmark)
    }
  }
})
