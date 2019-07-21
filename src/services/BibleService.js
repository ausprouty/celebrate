import axios from 'axios'
import store from '@/store/store.js'

const apiSELECT = axios.create({
  baseURL: 'https://create.myfriends.network/',
  withCredentials: false, // This is the default
  crossDomain: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
export default {
  async getBibleVersions(params) {
    params.my_uid = store.state.user.uid
    params.token = store.state.user.token
    console.log('params in getBibles')
    console.log(params)
    var contentForm = this.toFormData(params)
    var result = apiSELECT.post(
      'AuthorApi.php?page=bible&action=getBibleVersions',
      contentForm
    )
    console.log(result)
    return result
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
