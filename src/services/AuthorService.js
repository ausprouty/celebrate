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
const apiIMAGE = axios.create({
  baseURL: 'http://create.myfriends.network/',
  withCredentials: false, // This is the default
  crossDomain: true,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
// I want to export a JSON.stringified of response.data.content.text
export default {
  createContentData(obj) {
    var d = new Date()
    obj.edit_date = d.getTime()
    obj.edit_uid = 1
    obj.token = store.state.user.token
    console.log('obj in Create Content')
    console.log(obj)
    var contentForm = this.toFormData(obj)
    console.log('about to create content')
    return apiSECURE.post('AuthorApi.php?crud=createContent', contentForm)
  },

  createDirectoryLanguages(country, languages) {
    var code = ''
    console.log('createDirectoryLanguages')
    console.log(languages)
    var arrayLength = languages.length
    for (var i = 0; i < arrayLength; i++) {
      code = languages[i].iso
      console.log(code)
      if (this.isFilename(code)) {
        var obj = {}
        obj.scope = 'language'
        obj.country = country
        obj.code = code
        obj.token = store.state.user.token
        var contentForm = this.toFormData(obj)
        apiSECURE.post('AuthorApi.php?crud=createDir', contentForm)
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
      apiSECURE.post('AuthorApi.php?crud=createDirectoryMenu', contentForm)
    }
  },
  createStyle(params) {
    console.log('createStyle')
    console.log(params)
    if (this.isFilename(params.file.name)) {
      console.log('is letters')
      var obj = {}
      obj.file = params.file
      obj.country_code = params.country
      obj.token = store.state.user.token
      var contentForm = this.toFormData(obj)
      apiSECURE.post('AuthorApi.php?crud=createStyle', contentForm)
    } else {
      console.log('NOT letters')
    }
  },
  createTemplate(params) {
    console.log('create Template')
    console.log(params)
    console.log('params.file.name')
    console.log(params.file.name)
    if (this.isFilename(params.file.name)) {
      console.log('is letters')
      var obj = {}
      obj.file = params.file
      obj.country_code = params.country
      obj.language_iso = params.language
      obj.token = store.state.user.token
      var contentForm = this.toFormData(obj)
      apiSECURE.post('AuthorApi.php?crud=createTemplate', contentForm)
    } else {
      console.log('NOT letters')
    }
  },
  async getFolders(params) {
    //console.log('getFolders')
    var folders = []
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?crud=folders',
      contentForm
    )
    //console.log(response)
    if (response.data.content) {
      folders = JSON.parse(response.data.content)
      folders.sort()
    }
    return folders
  },
  async getFoldersLanguage() {
    var folders = []
    var params = {}
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?crud=getFoldersLanguage',
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
      'AuthorApi.php?crud=getFoldersImages',
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
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'ResourceApi.php?resource=images',
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
      'AuthorApi.php?crud=getStyles',
      contentForm
    )
    // console.log(response)
    if (response.data.content) {
      styles = JSON.parse(response.data.content)
      styles.sort()
    }
    return styles
  },
  async getTemplates(params) {
    var templates = []
    // console.log('getTemplates')
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?crud=getTemplates',
      contentForm
    )
    //console.log(response)
    if (response.data.content) {
      templates = JSON.parse(response.data.content)
      templates.sort()
    }
    return templates
  },
  async getUser(params) {
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?crud=authorize',
      contentForm
    )
    return response
  },
  isFilename(s) {
    return s.match('^[a-zA-Z0-9-_.]+$')
  },
  isFoldername(s) {
    return s.match('^[a-zA-Z0-9-_/]+$')
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
          apiSECURE.post('AuthorApi.php?crud=setupCountry', contentForm)
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
      var contentForm = this.toFormData(obj)
      apiSECURE.post('AuthorApi.php?crud=setupLanguageFolder', contentForm)
    }
  },
  setupImageFolder(country, language) {
    if (this.isFilename(language)) {
      var obj = {}
      obj.language_iso = language
      obj.country_code = country
      obj.token = store.state.user.token
      var contentForm = this.toFormData(obj)
      apiSECURE.post('AuthorApi.php?crud=setupImageFolder', contentForm)
    }
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
  async storeImage(params, image) {
    console.log('Store Image')
    console.log(params)
    console.log(image)
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    contentForm.append('file', image)
    console.log(contentForm)
    return apiIMAGE.post('AuthorApi.php?crud=image', contentForm)
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
  }
}
