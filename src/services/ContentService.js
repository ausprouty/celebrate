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
    // for latest get data
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
    // if no data or need current get content
    if (!found) {
      response.data = {}
      response.data.content = {}
      let res = await apiClient.get('content/countries.json')
      response.data.content.text = res.data
      response.source = 'content'
      return response
    }
  },

  async getLanguages(params) {
    var found = false
    var response = {}
    // for latest get data
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      let res = await apiMYSQL.post(
        'ContentApi.php?crud=languages',
        contentForm
      )
      console.log('getLangauges - data')
      console.log(res)
      if (res.data.content) {
        found = true
        response = res
        response.data.content.text = JSON.parse(res.data.content.text)
        response.source = 'data'
        return response
      }
    }
    // if no data or need current get content
    if (!found) {
      response.data = {}
      response.data.content = {}
      let res = await apiClient.get(
        'content/' + params.countryCODE + '/languages.json'
      )
      response.data.content.text = res.data
      response.source = 'content'
      return response
    }
  },

  async getLibrary(params) {
    var found = false
    var response = {}
    // for latest get data
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
    // if no data or need current get content
    if (!found) {
      response.data = {}
      response.data.content = {}
      let res = await apiClient.get(
        '/content/' +
          params.countryCODE +
          '/' +
          params.languageISO +
          '/library.json'
      )
      response.data.content.text = res.data
      response.source = 'content'
      return response
    }
  },
  async getSeries(params) {
    var found = false
    var response = {}
    // for latest get data
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      response = await apiMYSQL.post('ContentApi.php?crud=series', contentForm)
      if (response.data.content) {
        found = true
        response.source = 'data'
        return response
      }
    }
    // if no data or need current get content
    if (!found) {
      response.data = {}
      response.data.content = {}

      let res = await apiClient.get(
        'content/' +
          params.countryCODE +
          '/' +
          params.languageISO +
          '/' +
          params.folderNAME +
          '/' +
          params.fileFILENAME + '.json'
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
    // for latest get data
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
    // if no data or need current get content
    if (!found) {
      response.source = 'content'
      let res = await apiClient.get(
        'content/' +
          params.countryCODE +
          '/' +
          params.languageISO +
          '/' +
          params.folderNAME +
          '/' +
          params.fileFILENAME +
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
    // Display the key/value pairs
    for (var pair of form_data.entries()) {
      console.log(pair[0] + ', ' + pair[1])
    }
    //console.log(form_data)
    return form_data
  }
}
