import Vue from 'vue'
import Vuex from 'vuex'
import DataService from '@/services/DataService.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseURL: `http://localhost:8080`,
    cssURL: `http://localhost:8080/css/`,
    appDir: {
      css: '/css/',
      country: '/images/country/',
      icon: '/images/icon/',
      library: '/images/library/',
      root: '/images/'
    },
    bookmark: localStorage.getItem('bookmark')
      ? JSON.parse(localStorage.getItem('bookmark'))
      : {}
  },
  mutations: {
    NEW_BOOKMARK(state, value) {
      console.log('country in new bookmark')
      console.log(value)
      state.bookmark = {}
      state.bookmark.country = value
      localStorage.setItem('bookmark', JSON.stringify(state.bookmark))
    },
    UPDATE_BOOKMARK(state, [mark, value]) {
      // console.log('mark is ' + mark)
      //console.log('value is ')
      // console.log(value)
      switch (mark) {
        case 'language':
          state.bookmark.language = value
          state.bookmark.series = {}
          state.bookmark.page = {}
          break
        case 'library':
          state.bookmark.library = value
          state.bookmark.series = {}
          state.bookmark.page = {}
          break

        case 'series':
          state.bookmark.series = value
          state.bookmark.page = {}
          break
        case 'page':
          state.bookmark.page = value
          break
      }
      localStorage.setItem('bookmark', JSON.stringify(state.bookmark))
    }
  },
  actions: {
    newBookmark({ commit }, value) {
      commit('NEW_BOOKMARK', value)
    },
    updateBookmark({ commit }, [mark, value]) {
      console.log('updateBookmark with')
      console.log(value)
      commit('UPDATE_BOOKMARK', [mark, value])
    },
    checkBookmark({ commit }, route) {
      console.log('Store.js shows route as')
      console.log(route)
      /* COUNTRY
        if route.country is not the same as bookmark start a new bookmark 
        with all new country information*/
      if (route.country != this.state.bookmark.country.code) {
        DataService.getCountries().then(response => {
          var value = {}
          var length = response.data.length
          for (var i = 0; i < length; i++) {
            if (response.data[i].code == route.country) {
              value = response.data[i]
            }
          }
          commit('NEW_BOOKMARK', value)
        })
      }
      /* LANGUAGE AND LIBRARY
        if route.language is not the same as bookmark 
        update language and erase all bookmark below*/
      if (route.language) {
        var currentLanguage = ''
        if (typeof this.state.bookmark.language != 'undefined') {
          currentLanguage = this.state.bookmark.language.iso
        }
        if (route.language != currentLanguage) {
          DataService.getLanguages(route.country).then(response => {
            var value = {}
            var length = response.data.length
            for (var i = 0; i < length; i++) {
              if (response.data[i].iso == route.language) {
                value = response.data[i]
              }
            }
            commit('UPDATE_BOOKMARK', ['language', value])
            DataService.getLibrary(route.country, route.language).then(
              response => {
                var value = response.data
                commit('UPDATE_BOOKMARK', ['library', value])
              }
            )
          })
        }
      }
      /* SERIES
        if route.seriesis not the same as bookmark 
        update book and erase all bookmark below*/
      if (route.series) {
        var currentSeries = ''
        if (typeof this.state.bookmark.series != 'undefined') {
          currentSeries = this.state.bookmark.series.book
        }
        if (route.series != currentSeries) {
          DataService.getSeries(
            route.country,
            route.language,
            folder,
            index
          ).then(response => {
            var value = {}
            console.log(response.data)
            var length = response.data.length
            for (var i = 0; i < length; i++) {
              if (response.data[i].series == route.series) {
                value = response.data[i]
              }
            }
            console.log('updating bookmark with value')
            console.log(value)
            commit('UPDATE_BOOKMARK', ['series', value])
          })
        }
      }
    }
  }
})
