import axios from 'axios'

const apiClient = axios.create({
  baseURL: `http://localhost:8080`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getCountries() {
    return apiClient.get('/content/countries.json')
  },
  getLanguages(country) {
    return apiClient.get('/content/' + country + '/language.json')
  },
  getLibrary(folder) {
    return apiClient.get('/library-' + id)
  }
}
