import Vue from 'vue'
import Vuex from 'vuex'
import DataService from '@/services/DataService.js'

Vue.use(Vuex)

export default new Vuex.Store({
state: {
baseURL: `http://localhost:8080`,
cssURL: `http://localhost:8080/css/`,
appDir: {
css: '/css/',
country: '/images/country/',
icon: '/images/icon/',
library: '/images/library/',
root: '/images/'
},
bookmark: localStorage.getItem('bookmark')
? JSON.parse(localStorage.getItem('bookmark'))
: {}
},
mutations: {
NEW_BOOKMARK(state, country) {
console.log('country in new bookmark')
console.log(country)
state.bookmark = {}
state.bookmark.country = country
localStorage.setItem('bookmark', JSON.stringify(state.bookmark))
},
UPDATE_BOOKMARK(state, [mark, value]) {
console.log('mark is ' + mark)
console.log('value is ')
console.log(value)
switch (mark) {
case 'language':
state.bookmark.language = value
break
case 'library':
state.bookmark.library = value
break
case 'book':
state.bookmark.book = value
break
case 'chapter':
state.bookmark.chapter = value
break
case 'page':
state.bookmark.page = value
break
}
localStorage.setItem('bookmark', JSON.stringify(state.bookmark))
}
},
actions: {
newBookmark({ commit }, country) {
commit('NEW_BOOKMARK', country)
},
updateBookmark({ commit }, [mark, value]) {
console.log('updateBookmark with')
console.log(value)
commit('UPDATE_BOOKMARK', [mark, value])
},
checkBookmark({ commit }, route) {
console.log('Store.js shows route as')
console.log(route)
//console.log('Store.js shows bookmark.country as')
//console.log(this.state.bookmark.country.code)
// checking country
if (route.country != this.state.bookmark.country.code) {
DataService.getCountries().then(response => {
var value = {}
var length = response.data.length
for (var i = 0; i < length; i++) {
if (response.data[i].code == route.country) {
value = response.data[i]
}
}
commit('NEW_BOOKMARK', value)
})
}
//language
//console.log('Passed Country check')
//console.log(route.language + ' is route langauge')
if (route.language) {
// console.log('this.state.bookmark')
//console.log(this.state.bookmark)
var currentLanguage = ''
if (typeof this.state.bookmark.language != 'undefined') {
currentLanguage = this.state.bookmark.language.iso
}
if (route.language != currentLanguage) {
DataService.getLanguages(route.country).then(response => {
var value = {}
var length = response.data.length
for (var i = 0; i < length; i++) {
if (response.data[i].iso == route.language) {
value = response.data[i]
}
}
// console.log('updating bookmark')
commit('UPDATE_BOOKMARK', ['language', value])
})
}
}
// book check
//console.log('Passed langauge check')
console.log(route.book + ' is route book')
if (route.book) {
console.log('this.state.bookmark')
console.log(this.state.bookmark)
var currentBook = ''
if (typeof this.state.bookmark.book != 'undefined') {
currentBook = this.state.bookmark.book.book
}
if (route.book != currentBook) {
console.log('colecting libary with ')
console.log(route.country + '' + route.language)
DataService.getLibrary(route.country, route.language).then(
response => {
var value = {}
console.log(response.data)
var length = response.data.length
for (var i = 0; i < length; i++) {
if (response.data[i].book == route.book) {
value = response.data[i]
}
}
console.log('updating bookmark with value')
console.log(value)
commit('UPDATE_BOOKMARK', ['book', value])
}
)
}
}
}
}
})
