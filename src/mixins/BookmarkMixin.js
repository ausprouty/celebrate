import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
Vue.use(Vuex)

export const bookMarkMixin = {
  computed: mapState(['bookmark', 'standard']),

  methods: {
    UnsetBookmarks() {
      this.$store.dispatch('unsetBookmark', ['country'])
    },
    async CheckBookmarks(route) {
    //  console.log('BOOKMARK SERVICE started')
      try {
        await this.CheckBookmarkCountry(route)
        await this.CheckBookmarkLanguageLibrary(route)
        await this.CheckBookmarkBookSeries(route)
        await this.CheckBookmarkPage(route)
      //  console.log(this.bookmark)
      //  console.log('BOOKMARK SERVICE --    FINISHED BOOKMARK')
        localStorage.setItem('bookmark', JSON.stringify(this.bookmark))
        return this.bookmark
      } catch (error) {
        console.log(
          'BOOKMARK SERVICE -- There was an error setting bookmarks:',
          error
        ) // Logs out the error
        this.error = error.toString()
      }
    },
    async CheckBookmarkCountry(route) {
      if (!route.countryCODE) {
        return null
      }
      try {
        var currentCountry = ''
        if (typeof this.bookmark.country != 'undefined') {
          if (typeof this.bookmark.country.code != 'undefined') {
            currentCountry = this.bookmark.country.code
          }
        }
        if (route.countryCODE != currentCountry) {
          var res = await ContentService.getCountries(route)
          var response = res.data.content.text
          var value = {}
          var length = response.length
          for (var i = 0; i < length; i++) {
            if (response[i].code == route.countryCODE) {
              value = response[i]
            }
          }
          this.$store.dispatch('updateBookmark', ['country', value])
        }
    //    console.log('BOOKMARK SERVICE --CheckBookmarkCountry    FINISHING ')
        return this.bookmark
      } catch (error) {
        console.log(
          'BOOKMARK SERVICE --CheckBookmarkCountry There was an error ',
          error
        ) //
      }
    },
    async CheckBookmarkLanguageLibrary(route) {
      /* LANGUAGE AND LIBRARY
           if route.languageISO is not the same as bookmark 
            update language and erase all bookmark below*/
      if (!route.languageISO) {
        this.$store.dispatch('unsetBookmark', ['language'])
        return null
      }
      if (route.languageISO) {
        try {
          var value = {}
          var response = ''
          var currentLanguage = ''
          if (typeof this.bookmark.language != 'undefined') {
            currentLanguage = this.bookmark.language.iso
          }
          if (route.languageISO != currentLanguage) {
            var res = await ContentService.getLanguages(route)
            response = res.data.content.text
            var length = response.length
            for (var i = 0; i < length; i++) {
              if (response[i].iso == route.languageISO) {
                value = response[i]
              }
            }
            this.$store.dispatch('updateBookmark', ['language', value])

            response = await ContentService.getLibrary(route)
            value = response.data.content.text
            this.$store.dispatch('updateBookmark', ['library', value])
          }
          if (typeof this.bookmark.library == 'undefined') {
            // console.log (route)
            response = await ContentService.getLibrary(route)
            value = response.data
            //console.log('BOOKMARK SERVICE --   library is ')
            //console.log(value)
            this.$store.dispatch('updateBookmark', ['library', value])
          }
          return this.bookmark
        } catch (error) {
          console.log(
            'BOOKMARK SERVICE -- There was an error in CheckBookmarkLanguageLibrary',
            error
          ) //
        }
      }
    },
    /* BOOK
      if route.book is not the same as bookmark 
      update book and erase all bookmark below*/
    async CheckBookmarkBookSeries(route) {
      if (!route.bookNAME) {
        this.$store.dispatch('unsetBookmark', ['book'])
        return null
      }
      if (route.bookNAME) {
        try {
          var currentBook = ''
          var value = {}
          if (typeof this.bookmark.book != 'undefined') {
            if (typeof this.bookmark.book.series != 'undefined') {
              currentBook = this.bookmark.series.book
            }
          }
          if (route.bookNAME != currentBook) {
            var library = this.bookmark.library
            var length = library.length
            for (var i = 0; i < length; i++) {
              if (library[i].book == route.bookNAME) {
                value = library[i]
              }
            }
            this.$store.dispatch('updateBookmark', ['book', value])
          }
          // now update series
          var currentSeries = ''
          if (this.bookmark.book.format != 'series') {
            this.$store.dispatch('unsetBookmark', ['series'])
            return this.bookmark
          }
          if (typeof this.bookmark.series.book != 'undefined') {
            currentSeries = this.bookmark.series.book
          }
          if (route.bookNAME != currentSeries) {
            // get folder and index from Library so you can get correct series
            route.folderNAME = this.bookmark.book.folder
            route.fileFILENAME = this.bookmark.book.index
            var response = await ContentService.getSeries(route)
            value = response.data.content
            this.$store.dispatch('updateBookmark', ['series', value])
          }
          return this.bookmark
        } catch (error) {
          console.log(
            'BOOKMARK SERVICE --CheckBookmarkSeries There was an error in CheckBookmarkBookSeries',
            error
          ) //
        }
      }
    },
    /* Page
            if route.page is not the same as bookmark 
            update book and erase all bookmark below*/
    async CheckBookmarkPage(route) {
      if (!route.pageNAME) {
        this.$store.dispatch('unsetBookmark', ['page'])
        return null
      }
      if (route.pageNAME) {
        try {
          var value = {}
          var currentPage = ''
          if (typeof this.bookmark.page != 'undefined') {
            currentPage = this.bookmark.page
          }
          if (route.pageNAME != currentPage) {
            //console.log('BOOKMARK SERVICE --    we have a new page')
            if (typeof this.bookmark.series != 'undefined') {
              // the page is part of a series
              if (typeof this.bookmark.series.chapters != 'undefined') {
                var chapters = {}
                chapters = this.bookmark.series.chapters
                //console.log('BOOKMARK SERVICE --    chapters')
                // console.log(chapters)
                var length = chapters.length
                for (var i = 0; i < length; i++) {
                  if (chapters[i].filename == route.pageNAME) {
                    value = chapters[i]
                  }
                }
              } else {
                value = this.bookmark.book
              }
              this.$store.dispatch('updateBookmark', ['page', value])
            } else {
              // it is a basic page from the library
              value = {}
              value.title = ''
              this.$store.dispatch('setBookmark', ['page', value])
            }
          }
          return this.bookmark
        } catch (error) {
          console.log(
            'BOOKMARK SERVICE -- There was an error in CheckBookmarkPage',
            error
          ) //
        }
      }
    }
  }
}
