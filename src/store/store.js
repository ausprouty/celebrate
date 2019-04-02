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
      image: 'journey.png',
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
    bookmark: {
      country: {
        code: '',
        english: '',
        name: '',
        index: '',
        image: ''
      },
      language: {
        id: 1,
        folder: '',
        iso: '',
        name: '',
        bible: '',
        life_issues: '',
        image_dir: '',
        nt: '',
        ot: '',
        rldir: ''
      },
      library: [
        {
          book: '',
          folder: '',
          format: '',
          id: '',
          image: '',
          index: '',
          instructions: '',
          title: ''
        }
      ],
      book: {
        book: '',
        folder: '',
        format: '',
        id: '',
        image: '',
        index: '',
        instructions: '',
        title: ''
      },
      series: {
        series: '',
        language: '',
        description: 'Not set',
        chapters: []
      }
    }
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
        case 'country':
          state.bookmark.country = {
            code: 'au',
            english: '',
            name: '',
            index: '',
            image: ''
          }
          break
        case 'language':
          state.bookmark.language = {
            id: '',
            folder: '',
            iso: '',
            name: '',
            bible: '',
            life_issues: '',
            image_dir: '',
            nt: '',
            ot: '',
            rldir: ''
          }
          break
        case 'library':
          state.bookmark.library = []
          break
        case 'book':
          state.bookmark.book = {
            book: '',
            folder: '',
            format: '',
            id: '',
            image: '',
            index: '',
            instructions: '',
            title: ''
          }
          break
        case 'series':
          state.bookmark.series = {
            series: '',
            language: '',
            description: 'This means not set',
            chapters: []
          }
          break
        case 'page':
          state.bookmark.page = ''
          break
      }
    }
  },
  actions: {
    newBookmark({ commit }, value) {
      commit('UNSET_BOOKMARK', [value])
    },
    updateBookmark({ commit }, [mark, value]) {
      console.log('STORE - BOOKMARK    updateBookmark with')
      console.log(value)
      commit('SET_BOOKMARK', [mark, value])
    },
    unsetBookmark({ commit }, [mark]) {
      commit('UNSET_BOOKMARK', [mark])
    }
  }
})
