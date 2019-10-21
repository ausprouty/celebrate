const apiURL = process.env.VUE_APP_URL

const apiSECURE = axios.create({
  baseURL: apiURL,
  withCredentials: false, // This is the default
  crossDomain: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
import axios from 'axios'
import store from '@/store/store.js'

// I want to export a JSON.stringified of response.data.content.text
export default {
  async publish(scope, params) {
    var action = null
    params.my_uid = store.state.user.uid
    params.token = store.state.user.token
    // params.bookmark = JSON.stringify(store.state.bookmark)

    // console.log('publish')
    // console.log(params)
    switch (scope) {
      case 'bookmark':
        action = 'AuthorApi.php?page=bookmark&action=bookmark'
        break
      case 'countries':
        action = 'AuthorApi.php?page=publishCountries&action=publishCountries'
        break
      case 'country':
        action = 'AuthorApi.php?page=publishCountry&action=publishCountry'
        break
      case 'language':
        action = 'AuthorApi.php?page=publish&action=publishLanguage'
        break
      case 'languages':
        action = 'AuthorApi.php?page=publishLanguages&action=publishLanguages'
        break
      case 'languagesAvailable':
        action =
          'AuthorApi.php?page=publishLanguagesAvailable&action=publishLanguagesAvailable'
        break
      case 'library':
        action = 'AuthorApi.php?page=publishLibrary&action=publishLibrary'
        break
      case 'libraryAndBooks':
        action =
          'AuthorApi.php?page=publishLibraryAndBooks&action=publishLibraryAndBooks'
        break
      case 'libraryIndex':
        action =
          'AuthorApi.php?page=publishLibraryIndex&action=publishLibraryIndex'
        break
      case 'series':
        action = 'AuthorApi.php?page=publishSeries&action=publishSeries'
        break
      case 'seriesAndChapters':
        action =
          'AuthorApi.php?page=publishSeriesAndChapters&action=publishSeriesAndChapters'
        break
      case 'page':
        action = 'AuthorApi.php?page=publishPage&action=publishPage'
        break
      case 'readyTopublishCountry':
        action =
          'AuthorApi.php?page=readyTopublish&action=readyTopublishCountry'
        break
      case 'readyTopublishLanguage':
        action =
          'AuthorApi.php?page=readyTopublish&action=readyTopublishLanguage'
        break
      case 'readyTopublishLibrary':
        action =
          'AuthorApi.php?page=readyTopublish&action=readyTopublishLibrary'
        break
      case 'readyTopublishSeries':
        action = 'AuthorApi.php?page=readyTopublish&action=readyTopublishSeries'
        break
      case 'default':
        action = null
    }
    //  console.log('action')
    //  console.log(action)
    var contentForm = this.toFormData(params)
    var response = await apiSECURE.post(action, contentForm)
    //  console.log('result of publish')
    // console.log(response)
    return response
  },

  toFormData(obj) {
    var form_data = new FormData()
    for (var key in obj) {
      form_data.append(key, obj[key])
    }
    // Display the key/value pairs
    // for (var pair of form_data.entries()) {
    //  console.log(pair[0] + ', ' + pair[1])
    //}
    //   console.log(form_data)
    return form_data
  }
}
