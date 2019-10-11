import axios from 'axios'
import store from '@/store/store.js'

const apiSELECT = axios.create({
  baseURL: process.env.VUE_APP_URL,
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
    /* requires params.language_iso
      and params.entry in form of 'Zephaniah 1:2-3'

    returns:
      params.dbt = array(
      'entry' => 'Zephaniah 1:2-3'
      'bookId' => 'Zeph',  
      'chapterId' => 1, 
      'verseStart' => 2, 
      'verseEnd' => 3,
      'collection_code' => 'OT' ,
     );
  */
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

  async getBiblePassage(params) {
    /*
  expects 
    params.dbt = array(
      'entry' => 'Zephaniah 1:2-3'
      'bookId' => 'Zeph',  
      'chapterId' => 1, 
      'verseStart' => 2, 
      'verseEnd' => 3,
      'collection_code' => 'OT' ,
     );
     params.bid 

  */

    params.my_uid = store.state.user.uid
    params.token = store.state.user.token
    console.log('params in getBiblePassage')
    console.log(params)
    var contentForm = this.toFormData(params)
    var res = await apiSELECT.post(
      'AuthorApi.php?page=bibleGetPassage&action=bibleGetPassage',
      contentForm
    )
    console.log('response from getBiblePassage')
    console.log (res)
    // I want the whole response so I can see any errors.
    return res
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
