import axios from 'axios'

const apiClient = axios.create({
  // baseURL: `http://prototype.myfriends.network`,
  // baseURL: `http://localhost:8080`,
  baseURL: '/',

  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

const apiMYSQL = axios.create({
  baseURL: 'http://localhost:8000/myfriends/',
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
// I want to export a JSON.stringified of response.data.content.text
export default {
  async getCountries(params) {
    var found = false
    var response = {}
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      let res = await apiMYSQL.post(
        'ContentApi.php?crud=countries',
        contentForm
      )
      if (res.data.content) {
        found = true
        response = res
        response.data.content.text = JSON.parse(res.data.content.text)
        response.source = 'data'
        return response
      }
    }
    if (!found) {
      response.data = {}
      response.data.content = {}
      let res = await apiClient.get('content/countries.json')
      response.data.content.text = JSON.stringify(res.data)
      response.source = 'content'
      return response
    }
  },

  async getLanguages(params) {
    var found = false
    var response = {}
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      let res = await apiMYSQL.post(
        'ContentApi.php?crud=languages',
        contentForm
      )
      if (res.data.content) {
        found = true
        response = res
        response.data.content.text = JSON.parse(res.data.content.text)
        response.source = 'data'
        return response
      }
    }
    if (!found) {
      response.data = {}
      response.data.content = {}
      let res = await apiClient.get(
        'content/' + params.country + '/languages.json'
      )
      response.data.content.text = res.data
      response.source = 'content'
      return response
    }
  },

  async getLibrary(params) {
    var found = false
    var response = {}
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      let res = await apiMYSQL.post('ContentApi.php?crud=library', contentForm)
      if (res.data.content) {
        found = true
        response = res
        response.data.content.text = JSON.parse(res.data.content.text)
        response.source = 'data'
        return response
      }
    }
    if (!found) {
      response.data = {}
      response.data.content = {}
      let res = await apiClient.get(
        '/content/' + params.country + '/' + params.language + '/library.json'
      )
      response.data.content.text = res.data
      return response
    }
  },
  async getSeries(params) {
    var found = false
    var response = {}
    var bound = params.index.indexOf('.json')
    var indexname = params.index
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      if (bound != -1) {
        indexname = params.index.substr(0, params.index.length - 5)
      }
      params.index = indexname
      response = await apiMYSQL.post('ContentApi.php?crud=series', contentForm)
      if (response.data.content) {
        found = true
        response.source = 'data'
        return response
      }
    }
    if (!found) {
      response.data = {}
      response.data.content = {}

      if (bound == -1) {
        indexname = params.index + '.json'
      }
      let res = await apiClient.get(
        'content/' +
          params.country +
          '/' +
          params.language +
          '/' +
          params.folder +
          '/' +
          indexname
      )
      response.data.content = res.data
      return response
    }
  },
  async getPage(params) {
    var found = false
    var response = {}
    response.data = {}
    response.data.content = {}
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      let response = await apiMYSQL.post(
        'ContentApi.php?crud=page',
        contentForm
      )
      if (response.data.content) {
        found = true
        response.source = 'data'
        return response
      }
    }
    if (!found) {
      response.source = 'content'
      let res = await apiClient.get(
        'content/' +
          params.country +
          '/' +
          params.language +
          '/' +
          params.folder +
          '/' +
          params.page +
          '.html'
      )
      response.data.content.text = res.data
      return response
    }
  },
  createContentData(contentForm) {
    return apiMYSQL.post('ContentApi.php?crud=create', contentForm)
  },
  toFormData(obj) {
    var form_data = new FormData()
    for (var key in obj) {
      form_data.append(key, obj[key])
    }
    console.log('CONTENT SERVICE -toFormData form_data')
    // Display the key/value pairs
    for (var pair of form_data.entries()) {
      console.log(pair[0] + ', ' + pair[1])
    }
    console.log(form_data)
    return form_data
  }
}
