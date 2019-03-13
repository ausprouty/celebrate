import ContentService from '@/services/ContentService.js'
export default {
  bookmarkCountry(route) {
    console.log('BOOKMARK.js - I came into bookmarkCountry')
    ContentService.getCountries()
      .then(response => {
        var value = {}
        console.log('BOOKMARK.js -coutnries')
        console.log(response.data)
        var length = response.data.length
        for (var i = 0; i < length; i++) {
          if (response.data[i].code == route.country) {
            value = response.data[i]
          }
        }
        console.log('BOOKMARK.js - finishing bookmarkCountry')
        return value
      })
      .catch(error => {
        console.log(
          'BOOKMARK.js -There was an error in  bookmarkCountry:',
          error.response
        ) // Logs out the error
      })
  },
  bookmarkLanguage(route) {
    console.log('BOOKMARK.js - I camt into bookmarkLANGUAGE')
    ContentService.getLanguages(route.country).then(response => {
      var value = {}
      var length = response.data.length
      for (var i = 0; i < length; i++) {
        if (response.data[i].iso == route.language) {
          value = response.data[i]
        }
      }
      console.log('BOOKMARK.js -finishing bookmarkCountry')
      return value
    })
  },
  bookmarkLibrary(route) {
    console.log('BOOKMARK.js -I camt into bookmarkLIBRARY')
    ContentService.getLibrary(route.country, route.language).then(response => {
      var value = response.data
      console.log('BOOKMARK.js -finishing bookmarkLibrary')
      return value
    })
  },
  bookmarkBook(route, library) {
    var length = library.length
    for (var i = 0; i < length; i++) {
      if (library[i].book == route.book) {
        //console.log('BOOKMARK.js -I found book in library')
        //console.log(library[i])
        return library[i]
      }
    }
  },
  bookmarkSeries(route, library) {
    var length = library.length
    var value = ''
    for (var i = 0; i < length; i++) {
      if (library[i].format == 'series') {
        if (library[i].book == route.series) {
          value = library[i]
        }
      }
    }
    console.log(
      'BOOKMARK.js - bookmarkSeries Here is my folder and index values'
    )
    console.log(value)
    if (value.folder) {
      var folder = value.folder
      var index = value.index
      ContentService.getSeries(
        route.country,
        route.language,
        folder,
        index
      ).then(response => {
        var value = response.data
        console.log('BOOKMARK.js - bookmarkSeries my response')
        console.log(value)
        return value
      })
    }
  },
  bookmarkPage(route, bookmark) {
    if (typeof this.state.bookmark.series != 'undefined') {
      if (typeof this.state.bookmark.series.chapters != 'undefined') {
        var chapters = bookmark.series.chapters
        var length = chapters.length
        for (var i = 0; i < length; i++) {
          if (chapters[i].filename == route.page) {
            var value = chapters[i]
          }
        }
      }
    } else {
      value = bookmark.book
    }
    return value
  },
  bookmark(route) {
    console.log('BOOKMARK.js -Bookmark.js shows route as')
    console.log(route)
    var bookmark = {}
    bookmark.country = this.bookmarkCountry(route)
    if (route.language) {
      bookmark.language = this.bookmarkLanguage(route)
      bookmark.library = this.bookmarkLibrary(route)
    }
    if (route.book) {
      bookmark.book = this.bookmarkBook(route, bookmark.library)
    }
    if (route.series) {
      bookmark.series = this.bookmarkSeries(route, bookmark.library)
    }
    if (route.page) {
      bookmark.page = this.bookmarkPage(route, bookmark)
    }
    console.log('BOOKMARK.js -Bookmark from Bookmark.js')
    console.log(bookmark)
    localStorage.setItem('bookmark', JSON.stringify(bookmark))
    return bookmark
  }
}
