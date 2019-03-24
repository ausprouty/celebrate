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
  async getCountries(version = 'current') {
    console.log(version + ' is version')
    console.log('CONTENT SERVICE - entered get countries')
    if (version != 'current') {
      console.log('CONTENT SERVICE - getCountries not current version')
      let response = await this.getCountriesData(version)
      response.source = 'content'
      console.log(
        'CONTENT SERVICE - getCountries returned from looking for data'
      )
      if (!response.data.content) {
        let response = await this.getCountriesContent()
        response.source = 'content'
        console.log(
          'CONTENT SERVICE - getCountries  response from CONTENT because no data'
        )
        console.log(response)
        return response
      } else {
        response.source = 'data'
        console.log('CONTENT SERVICE - getCountries response from DATA ')
        console.log(response.data.content)
        return response
      }
    } else {
      let response = await this.getCountriesContent()
      response.source = 'content'
      console.log(
        'CONTENT SERVICE - getCountries response from CONTENT as requested'
      )
      console.log(response)
      return response
    }
  },
  async getCountriesContent() {
    var response = {}
    response.data = {}
    let res = await apiClient.get('content/countries.json')
    response.data.content = {}
    response.data.content.text = JSON.stringify(res.data)
    console.log('CONTENT SERVICE - data obtained from getCountriesContent')
    console.log(response)
    return response
  },
  async getCountriesData(version) {
    console.log(
      'CONTENT SERVICE - getCountriesData attempted getting countries DATA'
    )
    var params = {
      version: version
    }
    var contentForm = this.toFormData(params)
    console.log('CONTENT SERVICE - getCountriesData contentForm obtained')
    console.log(contentForm)
    var response = await apiMYSQL.post(
      'ContentApi.php?crud=countries',
      contentForm
    )
    console.log('CONTENT SERVICE -  getCountriesData response')
    console.log(response)

    return response
  },
  async getLanguages(country, version = 'current') {
    console.log('CONTENT SERVICE - entered get languages')
    console.log('CONTENT SERVICE - ' + version + ' is version')
    if (version != 'current') {
      console.log('CONTENT SERVICE -getLanguages  not current version')
      let response = await this.getLanguagesData(country, version)
      response.source = 'data'
      console.log(
        'CONTENT SERVICE - getLanguages returned from looking for data'
      )
      console.log(response)
      if (!response.data.content) {
        let response = await this.getLanguagesContent(country, version)
        response.source = 'content'
        console.log(
          'CONTENT SERVICE - getLanguages response from CONTENT because no data'
        )
        console.log(response)
        return response
      } else {
        console.log('CONTENT SERVICE - getLanguages response from DATA')
        console.log(response)
        return response
      }
    } else {
      let response = await this.getLanguagesContent(country, version)
      response.source = 'content'
      console.log(
        'CONTENT SERVICE - language response from CONTENT as requested'
      )
      console.log(response)
      return response
    }
  },
  async getLanguagesContent(country, version) {
    let res = await apiClient.get('content/' + country + '/languages.json')
    var response = {}
    response.data = {}
    response.data.content = {}
    response.data.content.text = JSON.stringify(res.data)
    console.log('CONTENT SERVICE - getLanguagesContent data obtained')
    console.log(response)
    return response
  },
  async getLanguagesData(country, version) {
    var params = {
      country: country,
      version: version
    }
    var contentForm = this.toFormData(params)
    console.log(
      'CONTENT SERVICE -  getLanguagesData about to post to ContentApi.php?crud=languages'
    )
    var response = await apiMYSQL.post(
      'ContentApi.php?crud=languages',
      contentForm
    )
    console.log('CONTENT SERVICE -  getLanguagesData response')
    console.log(response)

    return response
  },

  async getLibrary(country, language, version = 'current') {
    console.log('CONTENT SERVICE -getLibrary version is ' + version)
    if (version != 'current') {
      console.log('CONTENT SERVICE -getLibrary not current version')
      let response = await this.getLibraryData(country, language, version)
      response.source = 'data'

      console.log('CONTENT SERVICE  -getLibrary returned from looking for data')
      if (!response.data.content) {
        let response = await this.getLanguagesContent(
          country,
          language,
          version
        )
        response.source = 'content'
        console.log(
          'CONTENT SERVICE  -getLibrary response from CONTENT because no data'
        )
        console.log(response)
        return response
      } else {
        console.log(
          'CONTENT SERVICE  -getLibrary response from DATA in ContentServie'
        )
        console.log(response.data.content)
        return response
      }
    } else {
      let response = await this.getLibraryContent(country, language, version)
      response.source = 'content'

      console.log(
        'CONTENT SERVICE  -getLibrary response from CONTENT as requested'
      )
      console.log(response)
      return response
    }
  },

  async getLibraryContent(country, language, version) {
    let res = await apiClient.get(
      '/content/' + country + '/' + language + '/library.json'
    )
    var response = {}
    response.data = {}
    response.data.content = {}
    response.data.content.text = JSON.stringify(res.data)
    console.log('CONTENT SERVICE -getLibraryContent  data obtained ')
    console.log(response)
    return response
  },
  async getLibraryData(country, language, version) {
    var params = {
      country: country,
      language: language,
      version: version
    }
    var contentForm = this.toFormData(params)
    console.log('CONTENT SERVICE -getLibraryContent contentForm obtained')
    console.log(contentForm)
    var promise = await apiMYSQL.post(
      'ContentApi.php?crud=library',
      contentForm
    )
    var response = promise
    console.log('CONTENT SERVICE -getLibraryContent response')
    console.log(response)

    return response
  },

  async getSeries(country, language, folder, index, version) {
    console.log('CONTENT SERVICE - version is ' + version)
    console.log('CONTENT SERVICE - entered getSeries')
    if (version != 'current') {
      console.log('CONTENT SERVICE - not current version')
      let response = await this.getSeriesData(
        country,
        language,
        folder,
        index,
        version
      )
      response.source = 'data'
      console.log(
        'CONTENT SERVICE -getSeries  response after from looking for data.  Does it have content?'
      )
      console.log(response)
      if (!response.data.content) {
        let response = await this.getSeriesContent(
          country,
          language,
          folder,
          index,
          version
        )
        response.source = 'content'
        console.log(
          'CONTENT SERVICE -getSeries response from CONTENT because no data'
        )
        console.log(response)
        return response
      } else {
        console.log(
          'CONTENT SERVICE -getSeries response from DATA in ContentServie'
        )
        console.log(response.data.content)
        return response
      }
    } else {
      let response = await this.getSeriesContent(
        country,
        language,
        folder,
        index,
        version
      )
      response.source = 'content'

      console.log('CONTENT SERVICE - response from CONTENT as requested')
      console.log(response)
      return response
    }
  },

  async getSeriesContent(country, language, folder, index, version) {
    var indexname = index
    var bound = index.indexOf('.json')
    if (bound == -1) {
      console.log(
        'CONTENT SERVICE - getSeriesContent -- adding .json to indexname'
      )
      indexname = index + '.json'
    }
    let res = await apiClient.get(
      'content/' + country + '/' + language + '/' + folder + '/' + indexname
    )
    console.log('CONTENT SERVICE - getSeriesContent -- res')
    console.log(res)
    var response = {}
    response.data = {}
    response.data.content = {}
    response.data.content = res.data
    console.log('CONTENT SERVICE - getSeriesContent -- data obtained')
    console.log(response)
    return response
  },
  async getSeriesData(country, language, folder, index, version) {
    console.log(
      'CONTENT SERVICE - getSeriesData  -- is looking for series with these params'
    )
    var indexname = index
    var bound = index.indexOf('.json')
    if (bound != -1) {
      console.log(
        'CONTENT SERVICE - getSeriesContent -- removing .json to indexname'
      )
      indexname = index.substr(0, index.length - 5)
    }
    var params = {
      country: country,
      language: language,
      folder: folder,
      index: indexname,
      version: version
    }
    console.log('CONTENT SERVICE - getSeriesData params')
    console.log(params)
    var contentForm = this.toFormData(params)
    console.log('CONTENT SERVICE - getSeriesData contentForm')
    console.log(contentForm)
    var promise = await apiMYSQL.post('ContentApi.php?crud=series', contentForm)
    var response = promise
    console.log('CONTENT SERVICE - getSeriesDATA response')
    console.log(response)

    return response
  },
  async getPage(country, language, folder, page, version = 'current') {
    console.log('CONTENT SERVICE -getPage ' + version + ' is version')

    if (version != 'current') {
      console.log('CONTENT SERVICE -getPage  not current version')
      let response = await this.getPageData(
        country,
        language,
        folder,
        page,
        version
      )
      response.source = 'datga'
      console.log('CONTENT SERVICE -getPage  returned from looking for data')
      if (!response.data.content) {
        let response = await this.getPageContent(
          country,
          language,
          folder,
          page,
          version
        )
        response.source = 'content'
        console.log(
          'CONTENT SERVICE -getPage  response from CONTENT because no data'
        )
        console.log(response)
        return response
      } else {
        console.log('CONTENT SERVICE -getPage response from DATA')
        console.log(response.data.content)
        return response
      }
    } else {
      let response = await this.getPageContent(
        country,
        language,
        folder,
        page,
        version
      )
      response.source = 'content'
      console.log('CONTENT SERVICE -getPage response from CONTENT as requested')
      console.log(response)
      return response
    }
  },

  async getPageContent(country, language, folder, page, version) {
    console.log('CONTENT SERVICE -getPageContent parameters')
    console.log(
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

  async getPageData(country, language, folder, page, version) {
    var params = {
      country: country,
      language: language,
      folder: folder,
      page: page,
      version: version
    }
    var contentForm = this.toFormData(params)
    return apiMYSQL.post('ContentApi.php?crud=page', contentForm)
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
