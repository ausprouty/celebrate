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
    revision: '1.1',
    baseURL: './',
    cssURL: './css/',
    standard: {
      image_dir: 'menu-europe',
      rldir: 'ltr',
      css: ''
    },
    content: {
      recnum: '',
      version: '1.1',
      edit_date: '',
      edit_uid: '',
      publish_uid: '',
      publish_date: '',
      language_iso: '',
      country_iso: '',
      section: '',
      filetype: '',
      title: '',
      filename: '',
      text: ''
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
    SET_BOOKMARK(state, [mark, value]) {
      switch (mark) {
        case 'country':
          state.bookmark.country = value
          break
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
    },
    UNSET_BOOKMARK(state, [mark]) {
      switch (mark) {
        case 'language':
          state.bookmark.language = undefined
          break
        case 'library':
          state.bookmark.library = undefined
          break
        case 'book':
          state.bookmark.book = undefined
          break
        case 'series':
          state.bookmark.series = undefined
          break
        case 'page':
          state.bookmark.page = undefined
          break
      }
    }
  },
  actions: {
    newBookmark({ commit }, value) {
      commit('NEW_BOOKMARK', value)
    },
    updateBookmark({ commit }, [mark, value]) {
      console.log('updateBookmark with')
      console.log(value)
      commit('SET_BOOKMARK', [mark, value])
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
      console.log('ABOVE is state bookmark at finished checking')
      localStorage.setItem('bookmark', JSON.stringify(this.state.bookmark))
      return this.state.bookmark
    },
    CheckBookmarkCountry({ commit }, route) {
      var currentCountry = ''
      if (typeof this.state.bookmark.country != 'undefined') {
        if (typeof this.state.bookmark.country.code != 'undefined') {
          currentCountry = this.state.bookmark.country.code
        }
      }
      if (route.country != currentCountry) {
        DataService.getCountries().then(response => {
          var value = {}
          var length = response.data.length
          for (var i = 0; i < length; i++) {
            if (response.data[i].code == route.country) {
              value = response.data[i]
            }
          }
          commit('SET_BOOKMARK', ['country', value])
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
        var value = {}
        console.log('have route in CheckBookmarkLanguageLIBRARY')
        var currentLanguage = ''
        if (typeof this.state.bookmark.language != 'undefined') {
          currentLanguage = this.state.bookmark.language.iso
        }
        if (route.language != currentLanguage) {
          console.log('looking for new language of ' + route.language)
          DataService.getLanguages(route.country).then(response => {
            var length = response.data.length
            for (var i = 0; i < length; i++) {
              if (response.data[i].iso == route.language) {
                value = response.data[i]
              }
            }
            commit('SET_BOOKMARK', ['language', value])
            DataService.getLibrary(route.country, route.language).then(
              response => {
                value = response.data
                //console.log('library is ')
                //console.log(value)
                commit('SET_BOOKMARK', ['library', value])
              }
            )
          })
        }
        if (typeof this.state.bookmark.library == 'undefined') {
          // console.log (route)
          DataService.getLibrary(route.country, route.language).then(
            response => {
              value = response.data
              //console.log('library is ')
              //console.log(value)
              commit('SET_BOOKMARK', ['library', value])
            }
          )
        }
      }
      if (!route.language) {
        // clear if not set
        commit('UNSET_BOOKMARK', ['language'])
        commit('UNSET_BOOKMARK', ['library'])
        console.log('I AM CLEARING LIBRARY ')
      }
      console.log('finishing CheckBookmarkLanguageLIBRARY')
      return this.state.bookmark
    },
    /* BOOK
if route.book is not the same as bookmark 
update book and erase all bookmark below*/
    CheckBookmarkBook({ commit }, route) {
      console.log('checking book')
      if (route.book) {
        var currentBook = ''
        if (typeof this.state.bookmark.book != 'undefined') {
          if (typeof this.state.bookmark.book.series != 'undefined') {
            currentBook = this.state.bookmark.series.book
          }
        }
        var value = {}
        if (route.book != currentBook) {
          var library = this.state.bookmark.library
          var length = library.length
          for (var i = 0; i < length; i++) {
            if (library[i].book == route.book) {
              console.log('I found book in library')
              console.log(library[i])
              value = library[i]
            }
          }
          console.log('updating bookmark BOOK with')
          console.log(value)
          commit('SET_BOOKMARK', ['book', value])
        }
      }
      if (!route.book) {
        console.log('clearing bookmark BOOK')
        commit('UNSET_BOOKMARK', ['book'])
      }
      console.log('finishing CheckBookmarkBOOK with ')
      console.log(this.state.bookmark)
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
              commit('SET_BOOKMARK', ['series', value])
            })
          } else {
            commit('UNSET_BOOKMARK', ['series'])
          }
        }
      } else {
        // clear if not set
        commit('UNSET_BOOKMARK', ['series'])
      }
      console.log('finishing CheckBookmarkSeries')
      return this.state.bookmark
    },
    /* Page
      if route.page is not the same as bookmark 
      update book and erase all bookmark below*/
    CheckBookmarkPage({ commit }, route) {
      console.log(' route in check bookmark PAGE')
      console.log(route)
      var value = {}
      if (route.page) {
        console.log(' route.page is ' + route.page)
        value = ''
        var currentPage = ''
        if (typeof this.state.bookmark.page != 'undefined') {
          currentPage = this.state.bookmark.page
        }
        if (route.page != currentPage) {
          // console.log('we have a new page')
          if (typeof this.state.bookmark.series != 'undefined') {
            // the page is part of a series
            if (typeof this.state.bookmark.series.chapters != 'undefined') {
              var chapters = {}
              chapters = this.state.bookmark.series.chapters
              // console.log('chapters')
              // console.log(chapters)
              var length = chapters.length
              for (var i = 0; i < length; i++) {
                if (chapters[i].filename == route.page) {
                  value = chapters[i]
                }
              }
            } else {
              value = this.state.bookmark.book
            }
            // console.log ('value for page')
            //  console.log (value)
            console.log('updating bookmark with PAGE value')
            console.log(value)
            commit('SET_BOOKMARK', ['page', value])
          } else {
            // it is a basic page from the library
            console.log('This is a basic page')
            value = {}
            value.title = ''
            commit('SET_BOOKMARK', ['page', value])
          }
        }
      } else {
        // clear if not set
        commit('UNSET_BOOKMARK', ['page'])
      }
      console.log('finishing CheckBookmarkPage')
      return this.state.bookmark
    }
  }
})
