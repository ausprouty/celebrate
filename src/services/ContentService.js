import axios from 'axios'

const apiClient = axios.create({
  // baseURL: `http://prototype.myfriends.network`,
  // baseURL: `http://localhost:8080`,
  baseURL: '/',

  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getCountries() {
    return apiClient.get('content/countries.json')
  },
  getLanguages(country) {
    return apiClient.get('content/' + country + '/languages.json')
  },

  getLibrary(country, language) {
    return apiClient.get(
      '/content/' + country + '/' + language + '/library.json'
    )
  },
  getSeries(country, language, folder, index) {
    return apiClient.get(
      'content/' +
        country +
        '/' +
        language +
        '/' +
        folder +
        '/' +
        index +
        '.json'
    )
  },
  getPage(country, language, folder, page) {
    return apiClient.get(
      'content/' +
        country +
        '/' +
        language +
        '/' +
        folder +
        '/' +
        page +
        '.html'
    )
  },
  getMembers() {
    return apiClient.get('http://localhost:8000/myfriends/MembersApi.php')
  },
  saveMember(memForm) {
    //console.log('in dataservice')
    // Display the key/value pairs
    //for (var pair of memForm.entries()) {
    //  console.log(pair[0] + ', ' + pair[1])
    //}
    return apiClient.post(
      'http://localhost:8000/myfriends/MembersApi.php?crud=create',
      memForm
    )
  },
  updateMember(memForm) {
    return apiClient.post(
      'http://localhost:8000/myfriends/MembersApi.php?crud=update',
      memForm
    )
  },
  deleteMember(memForm) {
    return apiClient.post(
      'http://localhost:8000/myfriends/MembersApi.php?crud=delete',
      memForm
    )
  }
}
