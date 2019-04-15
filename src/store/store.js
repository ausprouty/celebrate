import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      uid: '',
      scope: '',
      firstname: '',
      lastname: '',
      token: ''
    },
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
      recnum: null,
      version: '1.1',
      edit_date: null,
      edit_uid: null,
      publish_uid: null,
      publish_date: null,
      language_iso: null,
      country_iso: null,
      folder: null,
      filetype: null,
      title: null,
      filename: null,
      text: null
    },
    bookmark: {
      country: {
        code: null,
        english: null,
        name: null,
        index: null,
        image: null
      },
      language: {
        id: 1,
        folder: null,
        iso: null,
        name: null,
        bible: null,
        life_issues: null,
        image_dir: null,
        nt: null,
        ot: null,
        rldir: null
      },
      library: [
        {
          book: null,
          folder: null,
          format: null,
          id: null,
          image: null,
          index: null,
          instructions: null,
          title: null
        }
      ],
      book: {
        book: null,
        folder: null,
        format: null,
        id: null,
        image: null,
        index: null,
        instructions: null,
        title: null
      },
      series: {
        series: null,
        language: null,
        description: 'Not set',
        chapters: []
      }
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
