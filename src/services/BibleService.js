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
    var result = await apiSELECT.post(
      'AuthorApi.php?page=bibleVersions&action=getBibleVersions',
      contentForm
    )
    console.log(result)
    return result
  },
  async getDbtArray(params) {
    params.my_uid = store.state.user.uid
    params.token = store.state.user.token
    console.log('params in getDbtArray')
    console.log(params)
    var contentForm = this.toFormData(params)
    var res = await apiSELECT.post(
      'AuthorApi.php?page=bibleDbtArray&action=createBibleDbtArrayFromPassage',
      contentForm
    )
    console.log('response in getDbtArray')
    console.log(res)
    if (typeof res.data.content !== 'undefined') {
      return res.data.content
    } else {
      return null
    }
  },
  async getbibleGetPassage(params) {
    var p = {}
    p.my_uid = store.state.user.uid
    p.token = store.state.user.token
    p.bookId = params.dbt.bookId
    p.chapterId = params.dbt.chapterId
    p.verseStart = params.dbt.verseStart
    p.verseEnd = params.dbt.verseEnd
    p.damId = params.damId
    console.log('params in getbibleGetPassage')
    console.log(p)
    var contentForm = this.toFormData(p)
    var res = await apiSELECT.post(
      'AuthorApi.php?page=bibleGetPassage&action=bibleGetPassage',
      contentForm
    )
    if (typeof res.data.content !== 'undefined') {
      console.log ('passage response')
      console.log (res.data.content)
      return res.data.content
    } else {
      return null
    }
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
