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

export default {
  async getCountries(revision = 'current') {
    console.log(revision + ' is revision')
    console.log('entered get countries')
    if (revision != 'current') {
      console.log('not current revision')
      let promise = this.getCountriesData(revision)
      let response = await promise
      console.log('returned from looking for data')
      if (!response.data) {
        let promise = this.getCountriesContent()
        let response = await promise
        console.log('response from content because no data')
        console.log(response)
        return response
      } else {
        console.log('response from data in ContentServie')
        console.log(response.data.content)
        return response
      }
    } else {
      let promise = this.getCountriesContent()
      let response = await promise
      console.log('response from content as requested')
      console.log(response)
      return response
    }
  },
  async getCountriesContent() {
    let promise = apiClient.get('content/countries.json')
    let res = await promise
    //console.log('res.data in getCountriesContent')
    //console.log(res.data)
    var response = {}
    response.data = {}
    response.data.content = {}
    response.data.content.text = JSON.stringify(res.data)
    console.log('data obtained')
    console.log(response)
    return response
  },
  async getCountriesData(revision) {
    console.log('attempted getting countries data')
    var params = {
      revision: revision
    }
    var contentForm = this.toFormData(params)
    console.log('contentForm obtained')
    console.log(contentForm)
    var promise = await apiMYSQL.post(
      'ContentApi.php?crud=countries',
      contentForm
    )
    var response = promise
    console.log('response')
    console.log(response)

    return response
  },
  async getLanguages(country, revision = 'current') {
    console.log(revision + ' is revision')
    console.log('entered get countries')
    if (revision != 'current') {
      console.log('not current revision')
      let promise = this.getLanguagesData(country, revision)
      let response = await promise
      console.log('returned from looking for data')
      if (!response.data) {
        let promise = this.getLanguagesContent(country)
        let response = await promise
        console.log('response from content because no data')
        console.log(response)
        return response
      } else {
        console.log('response from data in ContentServie')
        console.log(response.data.content)
        return response
      }
    } else {
      let promise = this.getLanguagesContent(country)
      let response = await promise
      console.log('response from content as requested')
      console.log(response)
      return response
    }
  },
  async getLanguagesContent(country, revision) {
    let promise = apiClient.get('content/' + country + '/languages.json')
    let res = await promise
    var response = {}
    response.data = {}
    response.data.content = {}
    response.data.content.text = JSON.stringify(res.data)
    console.log('data obtained')
    console.log(response)
    return response
  },
  async getLanguagesData(country, revision) {
    var params = {
      country: country,
      revision: revision
    }
    var contentForm = this.toFormData(params)
    console.log('about to post to with ContentApi.php?crud=languages')
    var promise = await apiMYSQL.post(
      'ContentApi.php?crud=languages',
      contentForm
    )
    var response = promise
    console.log('response')
    console.log(response)

    return response
  },

  async getLibrary(country, language, revision = 'current') {
    console.log(revision + ' is revision')
    console.log('entered get countries')
    if (revision != 'current') {
      console.log('not current revision')
      let promise = this.getLibraryData(country, language, revision)
      let response = await promise
      console.log('returned from looking for data')
      if (!response.data) {
        let promise = this.getLanguagesContent(country, language, revision)
        let response = await promise
        console.log('response from content because no data')
        console.log(response)
        return response
      } else {
        console.log('response from data in ContentServie')
        console.log(response.data.content)
        return response
      }
    } else {
      let promise = this.getLibraryContent(country, language, revision)
      let response = await promise
      console.log('response from content as requested')
      console.log(response)
      return response
    }
  },

  async getLibraryContent(country, language, revision) {
    let promise = apiClient.get(
      '/content/' + country + '/' + language + '/library.json'
    )
    let res = await promise
    var response = {}
    response.data = {}
    response.data.content = {}
    response.data.content.text = JSON.stringify(res.data)
    console.log('data obtained')
    console.log(response)
    return response
  },
  async getLibraryData(country, language, revision) {
    var params = {
      country: country,
      language: language,
      revision: revision
    }
    var contentForm = this.toFormData(params)
    console.log('contentForm obtained')
    console.log(contentForm)
    var promise = await apiMYSQL.post(
      'ContentApi.php?crud=library',
      contentForm
    )
    var response = promise
    console.log('response')
    console.log(response)

    return response
  },

  async getSeries(country, language, folder, index, revision = 'current') {
    console.log(revision + ' is revision')
    console.log('entered get countries')
    if (revision != 'current') {
      console.log('not current revision')
      let promise = this.getSeriesData(
        country,
        language,
        folder,
        index,
        revision
      )
      let response = await promise
      console.log('returned from looking for data')
      if (!response.data) {
        let promise = this.getSeriesContent(
          country,
          language,
          folder,
          index,
          revision
        )
        let response = await promise
        console.log('response from content because no data')
        console.log(response)
        return response
      } else {
        console.log('response from data in ContentServie')
        console.log(response.data.content)
        return response
      }
    } else {
      let promise = this.getSeriesContent(
        country,
        language,
        folder,
        index,
        revision
      )
      let response = await promise
      console.log('response from content as requested')
      console.log(response)
      return response
    }
  },

  async getSeriesContent(country, language, folder, index, revision) {
    let promise = apiClient.get(
      'content/' +
        country +
        '/' +
        language +
        '/' +
        folder +
        '/' +
        index +
        '.json'
    )
    let res = await promise
    var response = {}
    response.data = {}
    response.data.content = {}
    response.data.content.text = JSON.stringify(res.data)
    console.log('data obtained')
    console.log(response)
    return response
  },
  async getSeriesData(country, language, folder, index, revision) {
    console.log('ContentService is looking for series with these params')
    var params = {
      country: country,
      language: language,
      folder: folder,
      index: index,
      revision: revision
    }
    console.log(params)
    var contentForm = this.toFormData(params)
    console.log('contentForm obtained')
    console.log(contentForm)
    var promise = await apiMYSQL.post('ContentApi.php?crud=series', contentForm)
    var response = promise
    console.log('response')
    console.log(response)

    return response
  },

  async getPageContent(country, language, folder, page, revision) {
    return apiClient.get(
      'content/' +
        country +
        '/' +
        language +
        '/' +
        folder +
        '/' +
        page +
        '.html'
    )
  },

  async getPageData(country, language, folder, page, revision) {
    var params = {
      country: country,
      language: language,
      folder: folder,
      page: page,
      revision: revision
    }
    var contentForm = this.toFormData(params)
    return apiMYSQL.post('ContentApi.php?crud=page', contentForm)
  },
  async createContentData(contentForm) {
    return apiMYSQL.post('ContentApi.php?crud=create', contentForm)
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
    console.log(form_data)
    return form_data
  }
}
