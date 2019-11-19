import axios from 'axios'
import store from '@/store/store.js'

const apiURL = process.env.VUE_APP_URL

const apiSELECT = axios.create({
  baseURL: apiURL,
  withCredentials: false, // This is the default
  crossDomain: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
const apiSECURE = axios.create({
  baseURL: apiURL,
  withCredentials: false, // This is the default
  crossDomain: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
const apiIMAGE = axios.create({
  baseURL: apiURL,
  withCredentials: false, // This is the default
  crossDomain: true,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
// I want to export a JSON.stringified of response.data.content.text
export default {
  async bookmark(params) {
    var contentForm = this.toAuthorizedFormData(params)
    var res = await apiSECURE.post(
      'AuthorApi.php?page=bookmark&action=bookmark',
      contentForm
    )
    if (res.data.content) {
      store.dispatch('updateAllBookmarks', res.data.content)
    } else {
      store.dispatch('newBookmark', null)
    }
    return res.data.content
  },
  async copyBook(params) {
    var contentForm = this.toAuthorizedFormData(params)
    return apiSECURE.post('AuthorApi.php?page=sql&action=copyBook', contentForm)
  },
  createContentData(params) {
    var d = new Date()
    params.edit_date = d.getTime()
    var contentForm = this.toAuthorizedFormData(params)
    //console.log('about to create content')
    return apiSECURE.post(
      'AuthorApi.php?page=create&action=createContent',
      contentForm
    )
  },
  createContentFolder(params) {
    var contentForm = this.toAuthorizedFormData(params)
    apiSECURE.post(
      'AuthorApi.php?page=create&action=createContentFolder',
      contentForm
    )
  },
  // languages is an array of language objects
  createDirectoryLanguages(content) {
    var code = ''
    //console.log('createDirectoryLanguages')
    //console.log(content)
    var route = JSON.parse(content.route)
    var arrayLength = content.length
    for (var i = 0; i < arrayLength; i++) {
      code = content[i].iso
      // console.log(code)
      if (this.isFilename(code)) {
        var obj = {}
        obj.scope = 'language'
        obj.country = route.country_code
        //console.log('Creating language directory for ' + code)
        obj.code = code
        obj.token = store.state.user.token
        var contentForm = this.toAuthorizedFormData(obj)
        apiSECURE.post(
          'AuthorApi.php?page=create&action=createDirectoryLanguages',
          contentForm
        )
      }
    }
  },
  createDirectoryMenu(country, language) {
    // console.log('createDirectoryMenu')
    //console.log(country, language)
    if (this.isFilename(language)) {
      var obj = {}
      obj.language_iso = language
      obj.country_code = country
      obj.token = store.state.user.token
      var contentForm = this.toAuthorizedFormData(obj)
      apiSECURE.post(
        'AuthorApi.php?page=create&action=createDirectoryMenu',
        contentForm
      )
    }
  },
  async createSeriesIndex(params) {
    var contentForm = this.toAuthorizedFormData(params)
    apiSECURE.post(
      'AuthorApi.php?page=create&action=createSeriesIndex',
      contentForm
    )
  },

  async createStyle(params) {
    if (this.isFilename(params.file.name)) {
      var contentForm = this.toAuthorizedFormData(params)
      apiSECURE.post(
        'AuthorApi.php?page=create&action=createStyle',
        contentForm
      )
    } else {
      // console.log('NOT letters')
    }
  },
  async createTemplate(params) {
    if (this.isFilename(params.file.name)) {
      var contentForm = this.toAuthorizedFormData(params)
      apiSECURE.post(
        'AuthorApi.php?page=create&action=createTemplate',
        contentForm
      )
      return true
    } else {
      // console.log('NOT letters')
      return false
    }
  },
  /////////////////////////////////////////////////
  async debug(params) {
    console.log('debug')
    var contentForm = this.toAuthorizedFormData(params)
    var action = 'AuthorApi.php?page=debug&action=' + params.action
    apiSECURE.post(action, contentForm)
  },

  ////////////////////////////////////////////////
  async deleteUser(params) {
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=deleteUser&action=deleteUser',
      contentForm
    )
    //  console.log('response from  deleteUser')
    //  console.log(response)
    return response
  },
  async getComparisons(params) {
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=getComparisons&action=getComparisons',
      contentForm
    )
    console.log(response)
    if (response.data.content) {
      var options = response.data.content
      console.log('Comparison options')
      console.log(options)
    }
    return options
  },
  async getFoldersContent(params) {
    //console.log('getFolders')
    var folders = []
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=get&action=getFoldersContent',
      contentForm
    )
    //console.log(response)
    if (response.data.content) {
      folders = JSON.parse(response.data.content)
      folders.sort()
    }
    return folders
  },
  async getContentFoldersForLanguage(language) {
    var folders = []
    var params = {}
    params.language_iso = language
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=getContentFoldersForLanguage&action=getContentFoldersForLanguage',
      contentForm
    )
    //console.log(response)
    if (response.data.content) {
      folders = JSON.parse(response.data.content)
      folders.sort()
    }
    return folders
  },
  async getCurrentBooks() {
    var params = {}
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=getCurrentBooks&action=getCurrentBooks',
      contentForm
    )
    return response
  },
  async getCurrentLanguages() {
    var params = {}
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=getCurrentLanguages&action=getCurrentLanguages',
      contentForm
    )
    return response
  },
  async getFoldersImages() {
    var folders = []
    var params = {}
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=get&action=getFoldersImages',
      contentForm
    )
    if (response.data.content) {
      folders = JSON.parse(response.data.content)
      folders.sort()
    }
    return folders
  },
  async getImages(params) {
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=get&action=getImages',
      contentForm
    )
    var images = []
    if (response.data.content) {
      images = JSON.parse(response.data.content)
    }
    return images
  },

  async getStyles(params) {
    var styles = []
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=get&action=getStyles',
      contentForm
    )
    // console.log(response)
    if (response.data.content) {
      styles = JSON.parse(response.data.content)
      styles.sort()
    }
    return styles
  },
  async getTemplate(params) {
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=get&action=getTemplate',
      contentForm
    )
    // console.log('response from  getTemplate')
    // console.log(response)
    return response.data.content
  },
  async getTemplates(params) {
    var templates = []
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=get&action=getTemplates',
      contentForm
    )
    if (response.data.content) {
      templates = JSON.parse(response.data.content)
      templates.sort()
    }
    return templates
  },
  async getUser(params) {
    var contentForm = this.toAuthorizedFormData(params)
    let res = await apiSELECT.post(
      'AuthorApi.php?page=getUser&action=getUser',
      contentForm
    )
    //  console.log('response from  getUsers')
    //   console.log(res)
    let response = JSON.parse(res.data.content)
    console.log(response)
    return response
  },
  async getUsers(params) {
    var contentForm = this.toAuthorizedFormData(params)
    let res = await apiSELECT.post(
      'AuthorApi.php?page=getUsers&action=getUsers',
      contentForm
    )
    let response = JSON.parse(res.data.content)
    return response
  },

  isFilename(s) {
    return s.match('^[a-zA-Z0-9-_.]+$')
  },
  isFoldername(s) {
    return s.match('^[a-zA-Z0-9-_/]+$')
  },

  async login(params) {
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?action=login',
      contentForm
    )
    return response
  },
  async prototype(params) {
    var contentForm = this.toAuthorizedFormData(params)
    var action =
      'AuthorApi.php?page=prototype&action=prototype' + params.actionCODE
    apiSECURE.post(action, contentForm)
  },
  async publish(params) {
    var contentForm = this.toAuthorizedFormData(params)
    var action = 'AuthorApi.php?page=publish&action=publish' + params.actionCODE
    apiSECURE.post(action, contentForm)
  },
  async registerUser(params) {
    var contentForm = this.toAuthorizedFormData(params)
    var response = await apiSELECT.post(
      'AuthorApi.php?page=register&action=registerUser',
      contentForm
    )
    return response
  },
  setupCountries(countries) {
    var code = ''
    //  console.log('setupCountriess')
    var arrayLength = countries.length
    for (var i = 0; i < arrayLength; i++) {
      code = countries[i].code
      if (code.length == 2) {
        if (this.isFilename(code)) {
          var params = {}
          params.country_code = code
          var contentForm = this.toAuthorizedFormData(params)
          apiSECURE.post(
            'AuthorApi.php?page=setup&action=setupCountry',
            contentForm
          )
        }
      }
    }
  },
  setupLanguageFolder(country, language) {
    if (this.isFilename(language)) {
      var params = {}
      params.language_iso = language
      params.country_code = country
      params.token = store.state.user.token
      var contentForm = this.toAuthorizedFormData(params)
      apiSECURE.post(
        'AuthorApi.php?page=setup&action=setupLanguageFolder',
        contentForm
      )
    }
  },
  setupImageFolder(country, language) {
    if (this.isFilename(language)) {
      var params = {}
      params.languageNAME = language
      params.country_code = country
      var contentForm = this.toAuthorizedFormData(params)
      apiSECURE.post(
        'AuthorApi.php?page=setup&action=setupImageFolder',
        contentForm
      )
    }
  },
  async setupSeries(params, file) {
    var contentForm = this.toAuthorizedFormData(params)
    contentForm.append('file', file)
    //  console.log(contentForm)
    return apiIMAGE.post(
      'AuthorApi.php?page=setup&action=setupSeries',
      contentForm
    )
  },
  async setupSeriesFirstSteps(params) {
    var contentForm = this.toAuthorizedFormData(params)
    apiSECURE.post(
      'AuthorApi.php?page=setup&action=setupSeriesFirstSteps',
      contentForm
    )
  },
  async imageStore(params, image) {
    var contentForm = this.toAuthorizedFormData(params)
    contentForm.append('file', image)
    //  console.log(contentForm)
    return apiIMAGE.post(
      'AuthorApi.php?page=image&action=imageStore',
      contentForm
    )
  },
  typeImage(file) {
    var type = null
    var filetype = file['type']
    switch (filetype) {
      case 'image/jpeg':
        type = '.jpg'
        break
      case 'image/png':
        type = '.png'
        break
      case 'image/gif':
        type = '.gif'
        break
      default:
    }
    return type
  },
  typeStyle(file) {
    var type = null
    var filetype = file['type']
    switch (filetype) {
      case 'text/css':
        type = '.css'
        break
      default:
    }
    return type
  },
  typeTemplate(file) {
    var type = null
    var filetype = file['type']
    switch (filetype) {
      case 'text/html':
        type = '.html'
        break
      default:
    }
    return type
  },

  toAuthorizedFormData(params) {
    params.my_uid = store.state.user.uid
    params.token = store.state.user.token
    var form_data = new FormData()
    for (var key in params) {
      form_data.append(key, params[key])
    }
    // Display the key/value pairs
    //   for (var pair of form_data.entries()) {
    //     console.log(pair[0] + ', ' + pair[1])
    //    }
    //console.log(form_data)
    return form_data
  },
  async updateUser(params) {
    var contentForm = this.toAuthorizedFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=updateUser&action=updateUser',
      contentForm
    )
    return response
  }
}
