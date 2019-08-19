const apiSECURE = axios.create({
  baseURL: 'https://create.myfriends.network/',
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

    console.log('publish')
    console.log(params)
    switch (scope) {
      case 'bookmark':
        action = 'AuthorApi.php?page=bookmark&action=bookmark'
        break
      case 'countries':
        action =
          'AuthorApi.php?page=prototypeCountries&action=prototypeCountries'
        break
      case 'country':
        action = 'AuthorApi.php?page=prototypeCountry&action=prototypeCountry'
        break
      case 'language':
        action = 'AuthorApi.php?page=prototype&action=prototypeLanguage'
        break
      case 'languages':
        action =
          'AuthorApi.php?page=prototypeLanguages&action=prototypeLanguages'
        break
      case 'library':
        action = 'AuthorApi.php?page=prototypeLibrary&action=prototypeLibrary'
        break
        case 'libraryAndBooks':
          action =
            'AuthorApi.php?page=prototypeLibraryAndBooks&action=prototypeLibraryAndBooks'
          break
      case 'libraryIndex':
        action =
          'AuthorApi.php?page=prototypeLibraryIndex&action=prototypeLibraryIndex'
        break
      case 'series':
        action = 'AuthorApi.php?page=prototypeSeries&action=prototypeSeries'
        break
      case 'seriesAndChapters':
        action =
          'AuthorApi.php?page=prototypeSeriesAndChapters&action=prototypeSeriesAndChapters'
        break
      case 'page':
        action = 'AuthorApi.php?page=prototypePage&action=prototypePage'
        break
      case 'readyToPrototypeCountry':
        action =
          'AuthorApi.php?page=readyToPrototype&action=readyToPrototypeCountry'
        break
      case 'readyToPrototypeLanguage':
        action =
          'AuthorApi.php?page=readyToPrototype&action=readyToPrototypeLanguage'
        break
      case 'readyToPrototypeLibrary':
        action =
          'AuthorApi.php?page=readyToPrototype&action=readyToPrototypeLibrary'
        break
      case 'readyToPrototypeSeries':
        action =
          'AuthorApi.php?page=readyToPrototype&action=readyToPrototypeSeries'
        break
      case 'default':
        action = null
    }
    console.log('action')
    console.log(action)
    var contentForm = this.toFormData(params)
    var response = await apiSECURE.post(action, contentForm)
    console.log('result of publish')
    console.log(response)
    return response
  },

  toFormData(obj) {
    var form_data = new FormData()
    for (var key in obj) {
      form_data.append(key, obj[key])
    }
    // Display the key/value pairs
    for (var pair of form_data.entries()) {
      //  console.log(pair[0] + ', ' + pair[1])
    }
    console.log(form_data)
    return form_data
  }
}
