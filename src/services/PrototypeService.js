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
  publish(scope, params) {
    console.log('publish')
    console.log(params)
    var response = null
    params.my_uid = store.state.user.uid
    params.token = store.state.user.token
    switch (scope) {
      case 'countries':
        response = this.publishCountries(params)
        break
      case 'language':
        response = this.publishLanguage(params)
        break
      case 'library':
        response = this.publishLibrary(params)
        break
      case 'series':
        response = this.publishSeries(params)
        break
      case 'page':
        response = this.publishPage(params)
        break
      case 'default':
        response = null
    }
    console.log('result of publish')
    console.log(response)
    return response
  },
  publishCountries(params) {
    console.log('in publishCountries')
    var contentForm = this.toFormData(params)
    var response = apiSECURE.post(
      'TestApi.php?page=publish&action=publishCountries',
      contentForm
    )
    return response
  },
  publishLanguage(params) {
    var contentForm = this.toFormData(params)
    var response = apiSECURE.post(
      'TestApi.php?page=publish&action=publishLanguage',
      contentForm
    )
    return response
  },
  publishLibrary(params) {
    var contentForm = this.toFormData(params)
    var response = apiSECURE.post(
      'AuthorApi.php?page=prototypeLibrary',
      contentForm
    )
    return response
  },
  publishSeries(params) {
    console.log('params in publish Series')
    console.log(params)
    var contentForm = this.toFormData(params)
    var response = apiSECURE.post(
      'AuthorApi.php?action=prototypeSeries',
      contentForm
    )
    return response
  },
  publishPage(params) {
    console.log('params in publish Page')
    console.log(params)
    var contentForm = this.toFormData(params)

    var response = apiSECURE.post(
      'TestApi.php?page=publish&action=publishPage',
      contentForm
    )
    return response
  },
  toFormData(obj) {
    var form_data = new FormData()
    for (var key in obj) {
      form_data.append(key, obj[key])
    }
    // Display the key/value pairs
    for (var pair of form_data.entries()) {
      // console.log(pair[0] + ', ' + pair[1])
    }
    console.log(form_data)
    return form_data
  }
}
