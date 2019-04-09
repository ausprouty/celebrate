import axios from 'axios'


const apiMYSQL = axios.create({
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
  async getUser(params) {
    var contentForm = this.toFormData(params)
    let response = await apiMYSQL.post(
      'AuthorApi.php?crud=authorize',
      contentForm
    )
    return response
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
