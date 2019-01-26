import Vue from 'vue'
import Vuex from 'vuex'
import DataService from '@/services/DataService.js'
import CheckBookmark from '@/components/CheckBookmark.js'

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
          state.bookmark.book = {}
          state.bookmark.page = {}
          break
        case 'library':
          state.bookmark.library = value
          state.bookmark.book = {}
          state.bookmark.series = {}
          state.bookmark.page = {}
          break
        case 'book':
          state.bookmark.book = value
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
      /* BOOK
        if route.book is not the same as bookmark 
        update book and erase all bookmark below*/
      if (route.book) {
        var currentBook = ''
        if (typeof this.state.bookmark.book != 'undefined') {
          currentSeries = this.state.bookmark.series.book
        }
        if (route.book != currentBook) {
          var library = this.state.bookmark.library
          var length = library.length
          for (var i = 0; i < length; i++) {
            if (library[i].book == route.book) {
              var value = library[i]
            }
          }
          console.log('updating bookmar with BOOK value')
          console.log(value)

          commit('UPDATE_BOOKMARK', ['book', value])
        }
      }
      /* Series
        if route.book is not the same as bookmark 
        update book and erase all bookmark below*/
      if (route.series) {
        var currentSeries = ''
        if (typeof this.state.bookmark.series != 'undefined') {
          currentSeries = this.state.bookmark.series //this.state.bookmark.series.book
        }
        if (route.series != currentSeries) {
          var folder = this.state.bookmark.book.folder
          var index = this.state.bookmark.book.index
          DataService.getSeries(
            route.country,
            route.language,
            folder,
            index
          ).then(response => {
            var value = response.data

            console.log('updating bookmark with SERIES value')
            console.log(value)
            commit('UPDATE_BOOKMARK', ['series', value])
          })
        }
      }
      /* Page
      if route.page is not the same as bookmark 
      update book and erase all bookmark below*/
      if (route.page) {
        console.log(' route.page is ' + route.page)
        value = ''
        var currentPage = ''
        if (typeof this.state.bookmark.page != 'undefined') {
          currentPage = '9' //this.state.bookmark.series.book
        }
        if (route.page != currentPage) {
          console.log('we have a new page')
          var chapters = {}
          chapters = this.state.bookmark.series
          console.log('chapters')
          console.log(chapters)

          var length = chapters.length
          for (var i = 0; i < length; i++) {
            if (chapters[i].book == route.page) {
              var value = chapters[i]
            }
          }
          console.log('updating bookmark with PAGE value')
          console.log(value)
          commit('UPDATE_BOOKMARK', ['page', value])
        }
      }
    }
  }
})
