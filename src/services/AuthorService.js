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
// I want to export a JSON.stringified of response.data.content.text
export default {
  async getImages(params) {
    var contentForm = this.toFormData(params)
    let response = await apiSELECT.post(
      'ResourceApi.php?resource=images',
      contentForm
    )
    return JSON.parse(response.data.content)
  },
  async getMenus() {
    let response = await apiSELECT.post('ResourceApi.php?resource=menu')
    return JSON.parse(response.data.content)
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
