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
  getCountries(revision) {
    var params = {
      revision: revision
    }
    var contentForm = this.toFormData(params)
    return apiClient.post('ContentApi.php?crud=countries', contentForm)
  },
  getLanguages(country, revision) {
    var params = {
      country: country,
      revision: revision
    }
    var contentForm = this.toFormData(params)
    return apiClient.post('ContentApi.php?crud=languages', contentForm)
  },
  getLibrary(country, language, revision) {
    var params = {
      country: country,
      language: language,
      revision: revision
    }
    var contentForm = this.toFormData(params)
    return apiClient.post('ContentApi.php?crud=library', contentForm)
  },
  getSeries(country, language, folder, index, revision) {
    var params = {
      country: country,
      language: language,
      folder: folder,
      index: index,
      revision: revision
    }
    var contentForm = this.toFormData(params)
    return apiClient.post('ContentApi.php?crud=series', contentForm)
  },
  getPage(country, language, folder, page, revision) {
    var params = {
      country: country,
      language: language,
      folder: folder,
      page: page,
      revision: revision
    }
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
    console.log('form_data')
    // Display the key/value pairs
    for (var pair of form_data.entries()) {
      console.log(pair[0] + ', ' + pair[1])
    }
    return form_data
  }
}
