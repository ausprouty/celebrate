import axios from 'axios'
import AuthorService from '@/services/AuthorService.js'
const apiContent = axios.create({
  //baseURL: `http://edit.myfriends.network`,
  // baseURL: `http://localhost:8080`,
  baseURL: '/',
  withCredentials: false, // This is the default
  crossDomain: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

const apiMYSQL = axios.create({
  //baseURL: 'http://localhost:8000/myfriends/',
  baseURL: 'https://create.myfriends.network/',
  withCredentials: false, // This is the default
  crossDomain: true,
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
        'ContentApi.php?scope=countries',
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
      let res = await apiContent.get('content/countries.json')
      response.data.content.text = res.data
      response.source = 'content'
      return response
    }
  },
  async getCountry(params) {
    console.log('in getCountry of Content Service')
    var found = false
    var response = {}
    var contentForm = this.toFormData(params)
    let res = await apiMYSQL.post('ContentApi.php?scope=country', contentForm)
    console.log(res)
    if (res.data.content) {
      found = true
      response = res
      response.data.content.text = res.data.content.text
      response.source = 'data'
      return response
    } else {
      response.data = {}
      response.source = 'none'
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
        'ContentApi.php?scope=languages',
        contentForm
      )
      //  console.log('getLangauges - data')
      //  console.log(res)
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
      console.log('here is the page I am looking for ')
      console.log('content/' + params.country_code + '/languages.json')
      let res = await apiContent.get(
        'content/' + params.country_code + '/languages.json'
      )
      console.log(res)
      response.data.content.text = res.data
      response.source = 'content'
      console.log('response from getLanguages')
      console.log(response)
      return response
    }
  },

  async getLibrary(params) {
    console.log('getLibrary')
    var found = false
    var response = {}
    // for latest get data
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      let res = await apiMYSQL.post('ContentApi.php?scope=library', contentForm)
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
      try {
        console.log('Library data not found')
        response.data = {}
        response.data.content = {}
        let res = await apiContent.get(
          '/content/' +
            params.country_code +
            '/' +
            params.language_iso +
            '/library.json'
        )
        console.log('page found')
        console.log(res)
        if (res.data.substring(0, 1 != '[')) throw 'No page'
        response.data.content.text = res.data
        response.source = 'content'
        return response

        // no library.json
      } catch (error) {
        console.log('We are going to try to create Directory Languages')
        await AuthorService.setupLanguageFolder(
          params.country_code,
          params.language_iso
        )
        response.data = {}
        response.data.content = {}
        // pulls from default library which may not exist
        let res = await apiContent.get(
          '/content/' +
            params.country_code +
            '/' +
            params.language_iso +
            '/library.json'
        )
        response.data.content.text = res.data
        response.source = 'content'
        return response
      }
    }
  },

  async getSeries(params) {
    var found = false
    var response = {}
    // for latest get data
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      response = await apiMYSQL.post('ContentApi.php?scope=series', contentForm)
      console.log('response from getSeries in Content Service')
      console.log(response)
      console.log('this was response from getSeries in Content Service')
      if (response.data) {
        console.log('I have response.data.content')
        var text = JSON.parse(response.data.content.text)
        response.data.content.description = text.description
        response.data.content.chapters = text.chapters
        found = true
        response.source = 'data'
        return response
      }
    }
    // if no data or need current get content
    if (!found) {
      try {
        console.log('I DO NOT have response.data.content')
        response.data = {}
        response.data.content = {}
        // may need to remove .json from some FILENAME

        let res = await apiContent.get(
          'content/' +
            params.country_code +
            '/' +
            params.language_iso +
            '/' +
            params.folder_name +
            '/index.json'
        )
        response.data.content = res.data
        return response
      } catch (error) {}
    }
  },

  async getPage(params) {
    console.log('getPage params:')
    console.log(params)
    var found = false
    var response = {}
    response.data = {}
    response.data.content = {}
    // for latest get data
    if (params.version != 'current') {
      var contentForm = this.toFormData(params)
      let response = await apiMYSQL.post(
        'ContentApi.php?scope=page',
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
      var filename = params.filename
      if (!filename.includes('.html')) {
        filename = filename + '.html'
      }
      let res = await apiContent.get(
        'content/' +
          params.country_code +
          '/' +
          params.language_iso +
          '/' +
          params.folder_name +
          '/' +
          filename
      )
      response.data.content.text = res.data
      return response
    }
  },
  validate(entry) {
    var clean = entry

    return clean
  },
  createContentData(obj) {
    var d = new Date()
    obj.edit_date = d.getTime()
    obj.edit_uid = 1
    var contentForm = this.toFormData(obj)
    console.log('about to create content')
    return apiMYSQL.post('AuthorApi.php?scope=create', contentForm)
  },
  toFormData(obj) {
    var form_data = new FormData()
    for (var key in obj) {
      form_data.append(key, obj[key])
    }
    // Display the key/value pairs
    //for (var pair of form_data.entries()) {
    //  console.log(pair[0] + ', ' + pair[1])
    //}
    //console.log(form_data)
    return form_data
  }
}
