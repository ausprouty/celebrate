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
  async getFolders(params) {
    console.log ('getFolders')
    params.token = store.state.user.token
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?crud=folders',
      contentForm
    )
    console.log(response)
    if (response.data.content) {
      return JSON.parse(response.data.content)
    } else return
  },
  async getImages(params) {
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'ResourceApi.php?resource=images',
      contentForm
    )
    if (response.data.content) {
      return JSON.parse(response.data.content)
    } else return
  },
  async getMenus() {
    let response = await apiSELECT.post('ResourceApi.php?resource=menu')
    if (response.data.content) {
      var menu = JSON.parse(response.data.content)
      return menu.sort()
    } else {
      return
    }
  },
  async getUser(params) {
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'AuthorApi.php?crud=authorize',
      contentForm
    )
    return response
  },
  createContentData(obj) {
    var d = new Date()
    obj.edit_date = d.getTime()
    obj.edit_uid = 1
    obj.token = store.state.user.token
    console.log('obj in Create Content')
    console.log(obj)
    var contentForm = this.toFormData(obj)
    console.log('about to create content')
    return apiSECURE.post('AuthorApi.php?crud=create', contentForm)
  },
  createDirectoryCountries(countries) {
    var code = ''
    console.log('createDirectoryCountries')
    var arrayLength = countries.length
    for (var i = 0; i < arrayLength; i++) {
      code = countries[i].code
      if (code.length == 2) {
        if (this.isLetter(code)) {
          var obj = {}
          obj.code = code
          obj.scope = 'country'
          obj.token = store.state.user.token
          var contentForm = this.toFormData(obj)
          apiSECURE.post('AuthorApi.php?crud=createDir', contentForm)
        }
      }
    }
  },
  createDirectoryLanguages(country, languages) {
    var code = ''
    console.log('createDirectoryLanguages')
    console.log(languages)
    var arrayLength = languages.length
    for (var i = 0; i < arrayLength; i++) {
      code = languages[i].iso
      console.log(code)
      if (this.isLetter(code)) {
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
  createDirectoryMenu(code) {
    console.log('createDirectoryMenu')
    console.log(code)
    if (this.isLetter(code)) {
      var obj = {}
      obj.code = code
      obj.scope = 'menu'
      obj.token = store.state.user.token
      var contentForm = this.toFormData(obj)
      apiSECURE.post('AuthorApi.php?crud=createDir', contentForm)
    }
  },
  isLetter(s) {
    return s.match('^[a-zA-Z]+$')
  },
  imageType(file) {
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
