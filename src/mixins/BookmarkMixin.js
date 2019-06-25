import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
import AuthorService from '@/services/AuthorService.js'
Vue.use(Vuex)

export const bookMarkMixin = {
  computed: mapState(['bookmark', 'standard']),

  methods: {
    async UnsetBookmarks() {
      return this.$store.dispatch('unsetBookmark', ['country'])
    },
    async CheckBookmarks(route) {
      console.log('BOOKMARK MIXIN started')
      console.log(route)
      try {
        await this.CheckBookmarkCountry(route)
        await this.CheckBookmarkLanguageLibrary(route)
        await this.CheckBookmarkBookSeries(route)
        await this.CheckBookmarkPage(route)
        //  console.log(this.bookmark)
        //  console.log('BOOKMARK MIXIN --    FINISHED BOOKMARK')
        localStorage.setItem('bookmark', JSON.stringify(this.bookmark))
        return this.bookmark
      } catch (error) {
        console.log(
          'BOOKMARK MIXIN -- There was an error setting bookmarks:',
          error
        ) // Logs out the error
        this.error = error.toString() + 'BOOKMARK MIXIN --CheckBookmarks'
        return null
      }
    },
    async CheckBookmarkCountry(route) {
      console.log('CheckBookmarkCountry')
      console.log(route)
      if (!route.country_code) {
        return null
      }
      try {
        var currentCountry = ''
        if (typeof this.bookmark.country != 'undefined') {
          if (typeof this.bookmark.country.code != 'undefined') {
            currentCountry = this.bookmark.country.code
          }
        }
        if (route.country_code != currentCountry) {
          console.log(route)
          var res = await ContentService.getCountries(route)
          console.log('res')
          console.log(res)
          var response = res.data.content.text
          console.log(response)
          var value = {}
          var length = response.length
          for (var i = 0; i < length; i++) {
            if (response[i].code == route.country_code) {
              value = response[i]
            }
          }
          this.$store.dispatch('updateBookmark', ['country', value])
        }
        //    console.log('BOOKMARK MIXIN --CheckBookmarkCountry    FINISHING ')
        return this.bookmark
      } catch (error) {
        console.log(
          'BOOKMARK MIXIN --CheckBookmarkCountry There was an error ',
          error
        )
        this.error = error.toString() + 'BOOKMARK MIXIN --CheckBookmarkCountry'
        return null
      }
    },
    async CheckBookmarkLanguageLibrary(route) {
      console.log('entered CheckBookmarkLanguageLibrary')
      console.log(route)
      /* LANGUAGE AND LIBRARY
           if route.language_iso is not the same as bookmark 
            update language and erase all bookmark below*/
      if (!route.language_iso) {
        console.log('language not set')
        this.$store.dispatch('unsetBookmark', ['language'])
        return null
      }
      if (route.language_iso) {
        try {
          var value = {}
          var response = ''
          //var currentLanguage = ''
          //if (typeof this.bookmark.language != 'undefined') {
          //  currentLanguage = this.bookmark.language.iso
          // }
          //if (route.language_iso != currentLanguage) {  in development the library can change
          var res = await ContentService.getLanguages(route)
          response = res.data.content.text
          var length = response.length
          for (var i = 0; i < length; i++) {
            if (response[i].iso == route.language_iso) {
              value = response[i]
            }
          }
         // console.log('Language Bookmark is ')
        //  console.log(value)
          this.$store.dispatch('updateBookmark', ['language', value])
         // console.log('Going to Content Service to GetLibrary with:')
         // console.log(route)
          response = await ContentService.getLibrary(route)
         // console.log('response from getLibrary')
         // console.log(response)
          value = {}
          if (typeof response.data.content.text.books !== 'undefined') {
            console.log ('l am using new values')
            value.books = response.data.content.text.books
              ? response.data.content.text.books
              : ''
            value.image = response.data.content.text.image
              ? response.data.content.text.image
              : 'journey.jpg'
            value.text = response.data.content.text.text
              ? response.data.content.text.text
              : ''
          } else {
            console.log ('l am using legacy values')
            value.books = response.data.content.text // from legacy data
            value.image = 'journey.jpg'
            value.text = ''
            console.log (value)
          }
          console.log('value')
          console.log(value)
          this.$store.dispatch('updateBookmark', ['library', value])
          // }
          if (typeof this.bookmark.library == 'undefined') {
            // console.log (route)
            response = await ContentService.getLibrary(route)
            value = response.data
            console.log('BOOKMARK MIXIN --   library is ')
            console.log(value)
            this.$store.dispatch('updateBookmark', ['library', value])
          }
          return this.bookmark
        } catch (error) {
          console.log(
            'BOOKMARK MIXIN -- There was an error in CheckBookmarkLanguageLibrary',
            error
          )
          this.error =
            error.toString() + ' BOOKMARK MIXIN -- CheckBookmarkLanguageLibrary'
          return null
        }
      }
    },
    /* BOOK
      if route.book is not the same as bookmark 
      update book and erase all bookmark below*/
    async CheckBookmarkBookSeries(route) {
      console.log('route in CheckBookmarkBookSeries')
      console.log(route)
      if (!route.folder_name) {
        this.$store.dispatch('unsetBookmark', ['book'])
        return null
      }
      if (route.folder_name) {
        try {
          var currentBook = ''
          var value = {}
          if (typeof this.bookmark.book != 'undefined') {
            if (typeof this.bookmark.book.series != 'undefined') {
              currentBook = this.bookmark.series.book
            }
          }
          if (route.folder_name != currentBook) {
            var books = this.bookmark.library.books
            var length = books.length
            for (var i = 0; i < length; i++) {
              if (books[i].name == route.folder_name) {
                value = books[i]
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
          if (typeof this.bookmark.series.name != 'undefined') {
            currentSeries = this.bookmark.series.name
          }
          if (route.folder_name != currentSeries) {
            var response = await ContentService.getSeries(route)
            console.log('I am getting series')
            console.log(response)
            if (typeof response.data.content != 'undefined') {
              value = response.data.content
              this.$store.dispatch('updateBookmark', ['series', value])
            }
          }
          return this.bookmark
        } catch (error) {
          console.log(
            'BOOKMARK MIXIN --There was an error in CheckBookmarkBookSeries',
            error
          )
          // need to create series index

          this.error =
            error.toString() + ' BOOKMARK MIXIN -- CheckBookmarkBookSeries'
          return null
        }
      }
    },
    /* Page
            if route.page is not the same as bookmark 
            update book and erase all bookmark below*/
    async CheckBookmarkPage(route) {
      //console.log('entering bookmark page')
      if (!route.filename) {
        this.$store.dispatch('unsetBookmark', ['page'])
        return null
      }
      if (route.filename) {
        try {
          var value = {}
          var currentPage = ''
          if (typeof this.bookmark.page != 'undefined') {
            currentPage = this.bookmark.page
          }
          if (route.filename != currentPage) {
            //console.log('BOOKMARK MIXIN --    we have a new page')
            if (typeof this.bookmark.series != 'undefined') {
              //console.log('the page is part of a series with chapters as')
              //console.log(this.bookmark.series.chapters)
              if (typeof this.bookmark.series.chapters != 'undefined') {
                var chapters = {}
                chapters = this.bookmark.series.chapters
                // console.log('BOOKMARK MIXIN --    chapters')
                // console.log(chapters)
                var length = chapters.length
                for (var i = 0; i < length; i++) {
                  if (chapters[i].filename == route.filename) {
                    value = chapters[i]
                  }
                }
              } else {
                value = this.bookmark.book
              }
              //console.log(value)
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
            'BOOKMARK MIXIN -- There was an error in CheckBookmarkPage',
            error
          )
          this.error = error.toString() + ' BOOKMARK MIXIN -- CheckBookmarkPage'
          return null
        }
      }
    }
  }
}
