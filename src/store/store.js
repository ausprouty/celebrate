import Vue from 'vue'
import Vuex from 'vuex'
import ContentService from '@/services/ContentService.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appDir: {
      css: '/css/',
      country: '/images/country/',
      icons: '/images/icons/',
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
      folder: '',
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
      console.log('STORE - NEW BOOKMARK    ')
      state.bookmark = {}
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
      console.log('STORE - BOOKMARK    updateBookmark with')
      console.log(value)
      commit('SET_BOOKMARK', [mark, value])
    },
    async checkBookmark({ dispatch, commit }, route) {
      console.log('STORE - BOOKMARK    route is')
      console.log(route)
      dispatch('CheckBookmarkCountry', route)
        .then(() => {
          dispatch('CheckBookmarkLanguageLibrary', route)
        })
        .then(() => {
          dispatch('CheckBookmarkSeries', route)
        })
        .then(() => {
          dispatch('CheckBookmarkBook', route)
        })
        .then(() => {
          dispatch('CheckBookmarkPage', route)
        })
        .then(() => {
          console.log(this.state.bookmark)
          console.log('STORE - BOOKMARK    FINISHED BOOKMARK')
          localStorage.setItem('bookmark', JSON.stringify(this.state.bookmark))
          return this.state.bookmark
        })
        .catch(error => {
          console.log(
            'STORE - BOOKMARK There was an error setting bookmarks:',
            error.response
          ) // Logs out the error
          this.error = error.toString()
        })
    },
    async CheckBookmarkCountry({ commit }, route) {
      if (!route.countryCODE) {
        return null
      }
      var currentCountry = ''
      if (typeof this.state.bookmark.country != 'undefined') {
        console.log('STORE - BOOKMARK bookmark.country is defined')
        if (typeof this.state.bookmark.country.code != 'undefined') {
          currentCountry = this.state.bookmark.country.code
        }
      }
      if (route.countryCODE != currentCountry) {
        console.log(
          'STORE - BOOKMARK    route.countryCODE is not currentCountry'
        )
        ContentService.getCountries(route).then(res => {
          console.log('STORE - BOOKMARK   CheckBookmarkCountry  res ')
          console.log(res)
          var response = res.data.content.text

          var value = {}
          var length = response.length
          for (var i = 0; i < length; i++) {
            if (response[i].code == route.countryCODE) {
              value = response[i]
            }
          }
          commit('SET_BOOKMARK', ['country', value])
        })
      }
      console.log('STORE - BOOKMARK    FINISHING CheckBookmarkCountry')
      return this.state.bookmark
    },
    async CheckBookmarkLanguageLibrary({ commit }, route) {
      /* LANGUAGE AND LIBRARY
     if route.languageISO is not the same as bookmark 
      update language and erase all bookmark below*/
      //  console.log('STORE - BOOKMARK   starting CheckBookmarkLanguageLibrary')
      if (route.languageISO) {
        var value = {}
        console.log(
          'STORE - BOOKMARK   CheckBookmarkLanguageLIBRARY  have route '
        )
        var currentLanguage = ''
        if (typeof this.state.bookmark.language != 'undefined') {
          currentLanguage = this.state.bookmark.language.iso
        }
        if (route.languageISO != currentLanguage) {
          console.log(
            'STORE - BOOKMARK   looking for new language of ' +
              route.languageISO
          )
          ContentService.getLanguages(route).then(res => {
            console.log(
              'STORE - CheckBookmarkLanguageLIBRARY this is response from getLanguages'
            )
            console.log(res)
            var response = res.data.content.text
            console.log(
              'STORE -CheckBookmarkLanguageLIBRARY this is parsed response from getLanguages'
            )
            console.log(response)
            var length = response.length
            console.log(
              'STORE - BOOKMARK  CheckBookmarkLanguageLIBRARY  length'
            )
            console.log(length)
            for (var i = 0; i < length; i++) {
              console.log('STORE - BOOKMARK   response[i]')
              console.log(response[i].iso)
              if (response[i].iso == route.languageISO) {
                value = response[i]
              }
            }
            console.log('STORE - BOOKMARK  CheckBookmarkLanguageLIBRARY value')
            console.log(value)
            commit('SET_BOOKMARK', ['language', value])
            ContentService.getLibrary(route).then(response => {
              value = response.data.content.text
              console.log(
                'STORE - BOOKMARK  CheckBookmarkLanguageLIBRARY library is '
              )
              console.log(value)
              commit('SET_BOOKMARK', ['library', value])
              console.log(
                'STORE -CheckBookmarkLanguageLIBRARY finishing CheckBookmarkLanguageLIBRARY'
              )
            })
          })
        }
        if (typeof this.state.bookmark.library == 'undefined') {
          // console.log (route)
          ContentService.getLibrary(route).then(response => {
            value = response.data
            //console.log('STORE - BOOKMARK   library is ')
            //console.log(value)
            commit('SET_BOOKMARK', ['library', value])
            console.log(
              'STORE - BOOKMARK  CheckBookmarkLanguageLIBRARY finishing '
            )
          })
        }
      }
      if (!route.languageISO) {
        // clear if not set
        commit('UNSET_BOOKMARK', ['language'])
        commit('UNSET_BOOKMARK', ['library'])
        console.log('STORE - BOOKMARK   UNSET LIBRARY ')
      }

      return this.state.bookmark
    },
    /* BOOK
if route.book is not the same as bookmark 
update book and erase all bookmark below*/
    async CheckBookmarkBook({ commit }, route) {
      console.log('STORE - BOOKMARK    checking book')
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
              console.log('STORE - BOOKMARK    I found book in library')
              console.log(library[i])
              value = library[i]
            }
          }
          console.log('STORE - BOOKMARK    updating bookmark BOOK with')
          console.log(value)
          commit('SET_BOOKMARK', ['book', value])
        }
        console.log('STORE - BOOKMARK    FINISHING CheckBookmarkBOOK with ')
        console.log(this.state.bookmark)
        return this.state.bookmark
      }
      if (!route.book) {
        console.log('STORE - BOOKMARK    UNSET  BOOK')
        commit('UNSET_BOOKMARK', ['book'])
        return null
      }
    },
    /* Series
    if route.book is not the same as bookmark 
    update book and erase all bookmark below*/
    async CheckBookmarkSeries({ commit }, route) {
      //   console.log('STORE - BOOKMARK    starting check bookmark series with route')
      //    console.log(route)
      if (route.series) {
        var currentSeries = ''
        if (typeof this.state.bookmark.series != 'undefined') {
          currentSeries = this.state.bookmark.series //this.state.bookmark.series.book
        }
        if (route.series != currentSeries) {
          // get folder and index from Library so you can get correct series
          console.log('STORE - BOOKMARK    new series')
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
          console.log('STORE - BOOKMARK    Here is my folder and index values')
          console.log(value)
          console.log('STORE - BOOKMARK    Here is my route values')
          console.log(route)
          if (value.folder) {
            var folder = value.folder
            var index = value.index
            ContentService.getSeries(route).then(response => {
              console.log(
                'STORE - CheckBookmarkSeries data returned from Content Service'
              )
              console.log(response)
              var value = response.data.content

              console.log(
                'STORE - CheckBookmarkSeries updating bookmark with SERIES value'
              )
              console.log(value)
              commit('SET_BOOKMARK', ['series', value])
            })
          } else {
            commit('UNSET_BOOKMARK', ['series'])
          }
        }
        console.log('STORE - BOOKMARK    FINISHING CheckBookmarkSeries')
        return this.state.bookmark
      } else {
        // clear if not set
        commit('UNSET_BOOKMARK', ['series'])
        console.log('STORE - BOOKMARK    UNSET SERIES')
        return null
      }
    },
    /* Page
      if route.page is not the same as bookmark 
      update book and erase all bookmark below*/
    async CheckBookmarkPage({ commit }, route) {
      var value = {}
      if (route.page) {
        value = ''
        var currentPage = ''
        if (typeof this.state.bookmark.page != 'undefined') {
          currentPage = this.state.bookmark.page
        }
        if (route.page != currentPage) {
          //console.log('STORE - BOOKMARK    we have a new page')
          if (typeof this.state.bookmark.series != 'undefined') {
            // the page is part of a series
            if (typeof this.state.bookmark.series.chapters != 'undefined') {
              var chapters = {}
              chapters = this.state.bookmark.series.chapters
              //console.log('STORE - BOOKMARK    chapters')
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
            console.log('STORE - BOOKMARK    updating bookmark with PAGE value')
            console.log(value)
            commit('SET_BOOKMARK', ['page', value])
          } else {
            // it is a basic page from the library
            console.log('STORE - BOOKMARK    This is a basic page')
            value = {}
            value.title = ''
            commit('SET_BOOKMARK', ['page', value])
          }
        }
        console.log('STORE - BOOKMARK    FINISHING CheckBookmarkPage')
        return this.state.bookmark
      } else {
        commit('UNSET_BOOKMARK', ['page'])
        console.log('STORE - BOOKMARK   UNSET PAGE')
        return null
      }
    }
  }
})
