import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import defaultBookmark from './default-bookmark'
import defaultUser from './default-user'
import { saveStatePlugin } from '@/utils.js' // <-- Import saveStatePlugin

Vue.use(Vuex)

const bookmark = JSON.parse(localStorage.getItem('bookmark')) || defaultBookmark
const user = JSON.parse(localStorage.getItem('user')) || defaultUser

export default new Vuex.Store({
  plugins: [saveStatePlugin], // <-- Use
  state: {
    bookmark,
    user,
    appDir: {
      css: '/content/',
      styles: '/styles/',
      country: '/images/country/',
      icons: '/images/icons/',
      library: '/content/',
      root: '/images/'
    },
    revision: '1.1',
    baseURL: './',
    cssURL: './content/',
    standard: {
      image_dir: 'ZZ/images/europe',
      image: 'journey.png',
      rldir: 'ltr',
      css: '',
      items: ['about', 'basics', 'community', 'compass', 'life', 'steps']
    },
    content: {
      recnum: null,
      version: '1.1',
      edit_date: null,
      edit_uid: null,
      publish_uid: null,
      publish_date: null,
      language_iso: null,
      country_code: null,
      folder: null,
      filetype: null,
      title: null,
      filename: null,
      text: null
    }
  },
  mutations: {
    LOGIN_USER(state, value) {
      state.user = value[0]
      console.log('token')
      console.log(state.user.token)
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    SET_USER_DATA(state, userData) {
      state.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${
        userData.token
      }`
    },
    NEW_BOOKMARK(state, value) {
      console.log('STORE - NEW BOOKMARK    ')
      state.bookmark = {}
    },
    UPDATE_ALL_BOOKMARKS(state, value) {
      console.log('STORE - UPDATE ALL BOOKMARKS    ')
      state.bookmark = {}
      if (typeof value.country != 'undefined') {
        state.bookmark.country = value.country
      }
      if (typeof value.language != 'undefined') {
        state.bookmark.language = value.language
      }
      if (typeof value.library != 'undefined') {
        state.bookmark.library = value.library
      }
      if (typeof value.series != 'undefined') {
        state.bookmark.series = value.series
      }
      if (typeof value.book != 'undefined') {
        state.bookmark.book = value.book
      }
      if (typeof value.page != 'undefined') {
        state.bookmark.page = value.page
      }
      console.log('state.bookmark')
      console.log(state.bookmark)
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
    updateAllBookmarks({ commit }, value) {
      console.log('cleared bookmark')
      commit('UPDATE_ALL_BOOKMARKS', value)
    },
    newBookmark({ commit }, value) {
      console.log('cleared bookmark')
      commit('UNSET_BOOKMARK', [value])
    },
    updateBookmark({ commit }, [mark, value]) {
      //  console.log('STORE - BOOKMARK    updateBookmark with')
      //   console.log(value)
      commit('SET_BOOKMARK', [mark, value])
    },
    unsetBookmark({ commit }, [mark]) {
      commit('UNSET_BOOKMARK', [mark])
    },
    loginUser({ commit }, [mark]) {
      commit('LOGIN_USER', [mark])
    },
    register({ commit }, credentials) {
      return axios
        .post('//localhost:3000/register', credentials)
        .then(({ data }) => {
          console.log('user data is', userData)
          commit('SET_USER_DATA', data)
        })
    }
  }
})
