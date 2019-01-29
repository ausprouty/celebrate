import Vue from 'vue'
import Vuex from 'vuex'
import DataService from '@/services/DataService.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appDir: {
      css: '/css/',
      country: '/images/country/',
      icon: '/images/icon/',
      library: '/images/library/',
      root: '/images/'
    },
    baseURL: `http://localhost:8080`,
    cssURL: `http://localhost:8080/css/`,
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

          break
        case 'library':
          state.bookmark.library = value

          break
        case 'book':
          state.bookmark.book = value

          break
        case 'series':
          state.bookmark.series = value

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
    checkBookmark({ dispatch, commit }, route) {
      console.log('Store.js shows route as')
      console.log(route)
      dispatch('CheckBookmarkCountry', route)
      dispatch('CheckBookmarkLanguageLibrary', route)
      dispatch('CheckBookmarkSeries', route)
      dispatch('CheckBookmarkBook', route)
      dispatch('CheckBookmarkPage', route)
      console.log(this.state.bookmark)
      console.log('above is state bookmark at finished checking')
      return this.state.bookmark
    },
    ZcheckBookmark({ commit }, route) {
      console.log('Store.js shows route as')
      console.log(route)
      dispatch('CheckBookmarkCountry', { route }).then(response => {
        if (route.language) {
          dispatch('CheckBookmarkLanguageLibrary', { route }).then(response => {
            dispatch('CheckBookmarkSeries', { route }).then(response => {
              dispatch('CheckBookmarkPage', { route })
            })
          })
        }
      })
    },
    CheckBookmarkCountry({ commit }, route) {
      var currentCountry = ''
      if (typeof this.state.bookmark.country.code != 'undefined') {
        currentCountry = this.state.bookmark.country.code
      }
      //    console.log('currentCountry in CheckBookmarkCountry(')
      //    console.log(currentCountry)
      //   console.log('route')
      //   console.log(route)

      if (route.country != currentCountry) {
        DataService.getCountries().then(response => {
          var value = {}
          var length = response.data.length
          for (var i = 0; i < length; i++) {
            if (response.data[i].code == route.country) {
              value = response.data[i]
            }
          }
          //     console.log('Country value')
          //     console.log(value)
          commit('NEW_BOOKMARK', value)
        })
      }
      console.log('finishing CheckBookmarkCountry')
      return this.state.bookmark
    },
    CheckBookmarkLanguageLibrary({ commit }, route) {
      /* LANGUAGE AND LIBRARY
     if route.language is not the same as bookmark 
      update language and erase all bookmark below*/
      //  console.log('starting CheckBookmarkLanguageLibrary')
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
      console.log('finishing CheckBookmarkLanguageLibrary')
      return this.state.bookmark
    },
    /* BOOK
if route.book is not the same as bookmark 
update book and erase all bookmark below*/
    CheckBookmarkBook({ commit }, route) {
      //console.log ('checking book')
      if (route.book) {
        var currentBook = ''
        if (typeof this.state.bookmark.book != 'undefined') {
          currentBook = this.state.bookmark.series.book
        }
        if (route.book != currentBook) {
          var library = this.state.bookmark.library
          var length = library.length
          for (var i = 0; i < length; i++) {
            if (library[i].book == route.book) {
              var value = library[i]
            }
          }
          // console.log('updating bookmar with BOOK value')
          //console.log(value)

          commit('UPDATE_BOOKMARK', ['book', value])
        }
      }
      console.log('finishing CheckBookmarkBook')
      return this.state.bookmark
    },
    /* Series
    if route.book is not the same as bookmark 
    update book and erase all bookmark below*/
    CheckBookmarkSeries({ commit }, route) {
      //    console.log('starting check bookmark series with route')
      //    console.log(route)
      if (route.series) {
        var currentSeries = ''
        if (typeof this.state.bookmark.series != 'undefined') {
          currentSeries = this.state.bookmark.series //this.state.bookmark.series.book
        }
        if (route.series != currentSeries) {
          console.log('new series')
          var value = {}
          var library = this.state.bookmark.library
          var length = library.length
          for (var i = 0; i < length; i++) {
            if (library[i].format == 'series') {
              if (library[i].book == route.series) {
                value = library[i]
              }
            }
          }
          console.log('Here is my folder and index values')
          console.log(value)
          if (value.folder) {
            var folder = value.folder
            var index = value.index
            DataService.getSeries(
              route.country,
              route.language,
              folder,
              index
            ).then(response => {
              var value = response.data

              //console.log('updating bookmark with SERIES value')
              // console.log(value)
              commit('UPDATE_BOOKMARK', ['series', value])
            })
          } else {
            commit('UPDATE_BOOKMARK', ['series', value])
          }
        }
      }
      console.log('finishing CheckBookmarkSeries')
      return this.state.bookmark
    },
    /* Page
      if route.page is not the same as bookmark 
      update book and erase all bookmark below*/
    CheckBookmarkPage({ commit }, route) {
      console.log(' route in check bookmark page')
      console.log(route)
      value = ''
      if (route.page) {
        console.log(' route.page is ' + route.page)
        value = ''
        var currentPage = ''
        if (typeof this.state.bookmark.page != 'undefined') {
          currentPage = this.state.bookmark.page
        }
        if (route.page != currentPage) {
          // console.log('we have a new page')
          if (typeof this.state.bookmark.series.chapters != 'undefined') {
            var chapters = {}
            chapters = this.state.bookmark.series.chapters
            // console.log('chapters')
            // console.log(chapters)
            var length = chapters.length
            for (var i = 0; i < length; i++) {
              if (chapters[i].filename == route.page) {
                var value = chapters[i]
              }
            }
          }
          else{
            var value = this.state.bookmark.book
          }
          // console.log ('value for page')
          //  console.log (value)
           console.log('updating bookmark with PAGE value')
          console.log(value)
          commit('UPDATE_BOOKMARK', ['page', value])
        }
      }
      console.log('finishing CheckBookmarkPage')
      return this.state.bookmark
    }
  }
})
