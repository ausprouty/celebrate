import axios from 'axios'
import store from '@/store/store.js'

const apiURL = process.env.VUE_APP_URL;

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
    params.my_uid = store.state.user.uid
    params.token = store.state.user.token
    // console.log('params for bookmark')
    // console.log(params)
    var contentForm = this.toFormData(params)
    var res = await apiSECURE.post(
      'AuthorApi.php?page=bookmark&action=bookmark',
      contentForm
    )
    // console.log('response for bookmark')
    //console.log(res.data)
    if (res.data.content) {
      store.dispatch('updateAllBookmarks', res.data.content)
    } else {
      store.dispatch('newBookmark', null)
    }

    return res.data.content
  },
  createContentData(params) {
    var d = new Date()
    params.edit_date = d.getTime()
    params.my_uid = store.state.user.uid
    params.token = store.state.user.token
    console.log('params in Create Content')
    console.log(params)
    var contentForm = this.toFormData(params)
    console.log('about to create content')
    return apiSECURE.post(
      'AuthorApi.php?page=create&action=createContent',
      contentForm
    )
  },
  createContentFolder(params) {
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    apiSECURE.post(
      'AuthorApi.php?page=create&action=createContentFolder',
      contentForm
    )
  },
  // languages is an array of language objects
  createDirectoryLanguages(content) {
    var code = ''
    console.log('createDirectoryLanguages')
    console.log(content)
    var route = JSON.parse(content.route)
    var arrayLength = content.length
    for (var i = 0; i < arrayLength; i++) {
      code = content[i].iso
      console.log(code)
      if (this.isFilename(code)) {
        var obj = {}
        obj.scope = 'language'
        obj.country = route.country_code
        console.log('Creating language directory for ' + code)
        obj.code = code
        obj.token = store.state.user.token
        var contentForm = this.toFormData(obj)
        apiSECURE.post(
          'AuthorApi.php?page=create&action=createDirectoryLanguages',
          contentForm
        )
      }
    }
  },
  createDirectoryMenu(country, language) {
    console.log('createDirectoryMenu')
    console.log(country, language)
    if (this.isFilename(language)) {
      var obj = {}
      obj.language_iso = language
      obj.country_code = country
      obj.token = store.state.user.token
      var contentForm = this.toFormData(obj)
      apiSECURE.post(
        'AuthorApi.php?page=create&action=createDirectoryMenu',
        contentForm
      )
    }
  },
  async createSeriesIndex(params) {
    console.log('createSeriesIndex')
    console.log(params)
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    apiSECURE.post(
      'AuthorApi.php?page=create&action=createSeriesIndex',
      contentForm
    )
  },

  async createStyle(params) {
    console.log('createStyle')
    console.log(params)
    if (this.isFilename(params.file.name)) {
      console.log('is letters')
      var obj = {}
      obj.file = params.file
      obj.country_code = params.country_code
      obj.token = store.state.user.token
      var contentForm = this.toFormData(obj)
      apiSECURE.post(
        'AuthorApi.php?page=create&action=createStyle',
        contentForm
      )
    } else {
      console.log('NOT letters')
    }
  },
  async createTemplate(params) {
    console.log('create Template')
    console.log(params)
    console.log('params.file.name')
    console.log(params.file.name)
    if (this.isFilename(params.file.name)) {
      console.log('is letters')
      var obj = {}
      obj.file = params.file
      obj.country_code = params.country_code
      obj.language_iso = params.language_iso
      obj.folder_name = params.folder_name
      obj.token = store.state.user.token
      var contentForm = this.toFormData(obj)
      apiSECURE.post(
        'AuthorApi.php?page=create&action=createTemplate',
        contentForm
      )
      return true
    } else {
      console.log('NOT letters')
      return false
    }
  },
  /////////////////////////////////////////////////
  async debug(params) {
    console.log('debug')
    params.token = store.state.user.token
    params.my_uid = store.state.user.uid
    var contentForm = this.toFormData(params)
    var action = 'AuthorApi.php?page=debug&action=' + params.action
    apiSECURE.post(action, contentForm)
  },

  ////////////////////////////////////////////////
  async deleteUser(params) {
    params.token = store.state.user.token
    console.log('params sent to deleteUser')
    console.log(params)
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=deleteUser&action=deleteUser',
      contentForm
    )
    console.log('response from  deleteUser')
    console.log(response)
    return response
  },
  async getFoldersContent(params) {
    //console.log('getFolders')
    var folders = []
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
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
    params.token = store.state.user.token
    console.log('getContentFoldersForLanguage')
    console.log(params)
    var contentForm = this.toFormData(params)
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
  async getFoldersImages() {
    var folders = []
    var params = {}
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
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
    var images = []
    params.token = store.state.user.token
    console.log('get Images')
    console.log(params)
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=get&action=getImages',
      contentForm
    )

    if (response.data.content) {
      images = JSON.parse(response.data.content)
    }
    return images
  },

  async getStyles(params) {
    var styles = []
    // console.log('getStyles')
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
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
    params.token = store.state.user.token
    console.log('params sent to getTemplate')
    console.log(params)
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=get&action=getTemplate',
      contentForm
    )
    console.log('response from  getTemplate')
    console.log(response)
    return response.data.content
  },
  async getTemplates(params) {
    var templates = []
    // console.log('getTemplates')
    params.token = store.state.user.token
    console.log('getTemplates')
    console.log(params)
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=get&action=getTemplates',
      contentForm
    )
    console.log('get Templates')
    console.log(response)
    if (response.data.content) {
      console.log('about to parse templates')
      templates = JSON.parse(response.data.content)
      console.log('did parse templates')
      templates.sort()
    }
    return templates
  },
  async getUser(params) {
    params.token = store.state.user.token
    console.log('params sent to getUsers')
    console.log(params)
    var contentForm = this.toFormData(params)
    let res = await apiSELECT.post(
      'AuthorApi.php?page=getUser&action=getUser',
      contentForm
    )
    console.log('response from  getUsers')
    console.log(res)
    let response = JSON.parse(res.data.content)
    console.log(response)
    return response
  },
  async getUsers(params) {
    params.token = store.state.user.token
    console.log('params sent to getUsers')
    console.log(params)
    var contentForm = this.toFormData(params)
    let res = await apiSELECT.post(
      'AuthorApi.php?page=getUsers&action=getUsers',
      contentForm
    )
    console.log('response from  getUsers')
    console.log(res)
    let response = JSON.parse(res.data.content)
    console.log(response)
    return response
  },

  isFilename(s) {
    return s.match('^[a-zA-Z0-9-_.]+$')
  },
  isFoldername(s) {
    return s.match('^[a-zA-Z0-9-_/]+$')
  },

  async login(params) {
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?action=login',
      contentForm
    )
    return response
  },
  async prototype(params) {
    console.log('prototype')
    console.log(params)
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    var action =
      'AuthorApi.php?page=prototype&action=prototype' + params.actionCODE
    apiSECURE.post(action, contentForm)
  },
  async publish(params) {
    console.log('publish')
    console.log(params)
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    var action = 'AuthorApi.php?page=publish&action=publish' + params.actionCODE
    apiSECURE.post(action, contentForm)
  },
  async registerUser(params) {
    console.log('registerUser')
    console.log(params)
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    var response = await apiSELECT.post(
      'AuthorApi.php?page=register&action=registerUser',
      contentForm
    )
    return response
  },
  setupCountries(countries) {
    var code = ''
    console.log('setupCountriess')
    var arrayLength = countries.length
    for (var i = 0; i < arrayLength; i++) {
      code = countries[i].code
      if (code.length == 2) {
        if (this.isFilename(code)) {
          var obj = {}
          obj.country_code = code
          obj.token = store.state.user.token
          var contentForm = this.toFormData(obj)
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
      var obj = {}
      obj.language_iso = language
      obj.country_code = country
      obj.token = store.state.user.token
      console.log('setupLanguageFolder')
      console.log(obj)
      var contentForm = this.toFormData(obj)
      apiSECURE.post(
        'AuthorApi.php?page=setup&action=setupLanguageFolder',
        contentForm
      )
    }
  },
  setupImageFolder(country, language) {
    if (this.isFilename(language)) {
      var obj = {}
      obj.languageNAME = language
      obj.country_code = country
      obj.token = store.state.user.token
      var contentForm = this.toFormData(obj)
      apiSECURE.post(
        'AuthorApi.php?page=setup&action=setupImageFolder',
        contentForm
      )
    }
  },
  async setupSeries(params, file) {
    console.log('setup Series')
    console.log(params)
    console.log(file)
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    contentForm.append('file', file)
    console.log(contentForm)
    return apiIMAGE.post(
      'AuthorApi.php?page=setup&action=setupSeries',
      contentForm
    )
  },
  async setupSeriesFirstSteps(params) {
    console.log('createSeriesFirstSteps')
    console.log(params)
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    apiSECURE.post(
      'AuthorApi.php?page=setup&action=setupSeriesFirstSteps',
      contentForm
    )
  },
  async imageStore(params, image) {
    console.log('Store Image')
    console.log(params)
    console.log(image)
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    contentForm.append('file', image)
    console.log(contentForm)
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

  toFormData(obj) {
    var form_data = new FormData()
    for (var key in obj) {
      form_data.append(key, obj[key])
    }
    // Display the key/value pairs
    //   for (var pair of form_data.entries()) {
    //     console.log(pair[0] + ', ' + pair[1])
    //    }
    //console.log(form_data)
    return form_data
  },
  async updateUser(params) {
    params.token = store.state.user.token
    console.log('params sent to deleteUser')
    console.log(params)
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?page=updateUser&action=updateUser',
      contentForm
    )
    console.log('response from  updateUsers')
    console.log(response)
    return response
  },
}
