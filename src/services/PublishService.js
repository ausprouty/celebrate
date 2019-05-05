import axios from 'axios'
import store from '@/store/store.js'

const apiSELECT = axios.create({
  baseURL: 'http://create.myfriends.network/',
  withCredentials: false, // This is the default
  crossDomain: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
const apiSECURE = axios.create({
  baseURL: 'http://create.myfriends.network/',
  withCredentials: false, // This is the default
  crossDomain: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
// I want to export a JSON.stringified of response.data.content.text
export default {
  publish(scope, params) {
    console.log('publish')
    console.log(params)
    params.edit_uid = store.state.user.uid
    params.token = store.state.user.token
    switch (scope) {
      case 'countries':
        this.publishCountries(params)
        break
      case 'language':
        this.publishLanguage(params)
        break
      case 'library':
        this.publishLibrary(params)
        break
      case 'series':
        this.publishSeries(params)
        break
      case 'page':
        this.publishPage(params)
        break
      case 'default':
    }
  },
  publishCountries(params) {
    var contentForm = this.toFormData(params)
    apiSECURE.post('PublishApi.php?action=publishCountries', contentForm)
  },
  publishLanguage(params) {
    var contentForm = this.toFormData(params)
    apiSECURE.post('PublishApi.php?action=publishLanguage', contentForm)
  },
  publishLibrary(params) {
    var contentForm = this.toFormData(params)
    apiSECURE.post('PublishApi.php?action=publishLibrar', contentForm)
  },
  publishSeries(params) {
    var contentForm = this.toFormData(params)
    apiSECURE.post('PublishApi.php?action=publishSeries', contentForm)
  },
  publishPage(params) {
    var contentForm = this.toFormData(params)
    apiSECURE.post('AuthorApi.php?action= publishPage', contentForm)
  },
  toFormData(obj) {
    var form_data = new FormData()
    for (var key in obj) {
      form_data.append(key, obj[key])
    }
    // Display the key/value pairs
    for (var pair of form_data.entries()) {
      console.log(pair[0] + ', ' + pair[1])
    }
    console.log(form_data)
    return form_data
  }
}
