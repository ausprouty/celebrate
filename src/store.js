import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    imgDir: {
      library: '/img/library/',
      country: '/img/',
      icon: '/img/icon/'
    },
    bookmark: localStorage.getItem('bookmark')
      ? JSON.parse(localStorage.getItem('bookmark'))
      : {}
  },
  mutations: {
    NEW_BOOKMARK(state, country) {
      console.log(country)
      state.bookmark = {}
      state.bookmark.country = country
      localStorage.setItem('bookmark', JSON.stringify(state.bookmark))
    },
    UPDATE_BOOKMARK(state, [mark, value]) {
      console.log('mark is ' + mark)
      console.log('value is ')
      console.log(value)
      switch (mark) {
        case 'language':
          state.bookmark.language = value
          break
        case 'library':
          state.bookmark.library = value
          break
        case 'book':
          state.bookmark.book = value
          break
        case 'page':
          state.bookmark.page = value
          break
      }
      localStorage.setItem('bookmark', JSON.stringify(state.bookmark))
    }
  },
  actions: {
    newBookmark({ commit }, country) {
      commit('NEW_BOOKMARK', country)
    },
    updateBookmark({ commit }, [mark, value]) {
      console.log('updateBookmark with')
      console.log(value)
      commit('UPDATE_BOOKMARK', [mark, value])
    }
  }
})
