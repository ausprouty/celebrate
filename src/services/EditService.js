import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/myfriends/',
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
export default {
  getCountries(params) {
    var contentForm = this.toFormData(params)
    return apiClient.post('ContentApi.php?crud=countries', contentForm)
  },
  getLanguages(params) {
    var contentForm = this.toFormData(params)
    return apiClient.post('ContentApi.php?crud=languages', contentForm)
  },
  getLibrary(params) {
    var contentForm = this.toFormData(params)
    return apiClient.post('ContentApi.php?crud=library', contentForm)
  },
  getSeries(params) {
    var contentForm = this.toFormData(params)
    return apiClient.post('ContentApi.php?crud=series', contentForm)
  },
  getPage(params) {
    var contentForm = this.toFormData(params)
    return apiClient.post('ContentApi.php?crud=page', contentForm)
  },
  createContent(contentForm) {
    return apiClient.post('ContentApi.php?crud=create', contentForm)
  },
  deleteContent(contentForm) {
    return apiClient.post('ContentApi.php?crud=delete', contentForm)
  },
  revertContent(contentForm) {
    return apiClient.post('ContentApi.php?crud=revert', contentForm)
  },
  toFormData(obj) {
    var form_data = new FormData()
    for (var key in obj) {
      form_data.append(key, obj[key])
    }
    //console.log('form_data')
    // Display the key/value pairs
    // for (var pair of form_data.entries()) {
    //   console.log(pair[0] + ', ' + pair[1])
    // }
    return form_data
  }
}
