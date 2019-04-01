import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
import ContentService from '@/services/ContentService.js'
Vue.use(Vuex)

export const bookMarkMixin = {
  computed: mapState(['bookmark', 'standard']),

  methods: {
    async CheckBookmarks(route) {
      console.log('BOOKMARK SERVICE started')
      var bm = this.bookmark
      console.log(bm)
      console.log('route')
      console.log(route)
      try {
        await this.CheckBookmarkCountry(route)
        await this.CheckBookmarkLanguageLibrary(route)
        await this.CheckBookmarkBookSeries(route)
        await this.CheckBookmarkPage(route)
        console.log(this.bookmark)
        console.log('BOOKMARK SERVICE --    FINISHED BOOKMARK')
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
      console.log(this.bookmark)
      if (!route.countryCODE) {
        return null
      }
      try {
        var currentCountry = ''
        if (typeof this.bookmark.country != 'undefined') {
          console.log(
            'BOOKMARK SERVICE --CheckBookmarkCountry bookmark.country is defined'
          )
          if (typeof this.bookmark.country.code != 'undefined') {
            currentCountry = this.bookmark.country.code
          }
        }
        if (route.countryCODE != currentCountry) {
          console.log(
            'BOOKMARK SERVICE --CheckBookmarkCountry    route.countryCODE is not currentCountry'
          )
          var res = await ContentService.getCountries(route)
          console.log('BOOKMARK SERVICE --CheckBookmarkCountry  res ')
          console.log(res)
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
        console.log('BOOKMARK SERVICE --CheckBookmarkCountry    FINISHING ')
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
        // clear if not set
        //commit('UNSET_BOOKMARK', ['language'])
        // commit('UNSET_BOOKMARK', ['library'])
        console.log(
          'BOOKMARK SERVICE --CheckBookmarkLanguageLibrary   UNSET LIBRARY '
        )
        return null
      }
      if (route.languageISO) {
        try {
          var value = {}
          var response = ''
          console.log(
            'BOOKMARK SERVICE --CheckBookmarkLanguageLIBRARY  have route '
          )
          var currentLanguage = ''
          if (typeof this.bookmark.language != 'undefined') {
            currentLanguage = this.bookmark.language.iso
          }
          if (route.languageISO != currentLanguage) {
            console.log(
              'BOOKMARK SERVICE --CheckBookmarkLanguageLibrary  looking for new language of ' +
                route.languageISO
            )
            var res = await ContentService.getLanguages(route)
            console.log(
              'BOOKMARK SERVICE  --CheckBookmarkLanguageLIBRARY this is response from getLanguages'
            )
            console.log(res)
            response = res.data.content.text
            console.log(
              'BOOKMARK SERVICE  --CheckBookmarkLanguageLIBRARY this is parsed response from getLanguages'
            )
            console.log(response)
            var length = response.length
            console.log(
              'BOOKMARK SERVICE --CheckBookmarkLanguageLIBRARY  length'
            )
            console.log(length)
            for (var i = 0; i < length; i++) {
              console.log('BOOKMARK SERVICE --   response[i]')
              console.log(response[i].iso)
              if (response[i].iso == route.languageISO) {
                value = response[i]
              }
            }
            console.log('BOOKMARK SERVICE --CheckBookmarkLanguageLIBRARY value')
            console.log(value)
            this.$store.dispatch('updateBookmark', ['language', value])

            response = await ContentService.getLibrary(route)
            value = response.data.content.text
            console.log(
              'BOOKMARK SERVICE --CheckBookmarkLanguageLIBRARY library is '
            )
            console.log(value)
            this.$store.dispatch('updateBookmark', ['library', value])
            console.log(
              'BOOKMARK SERVICE  --CheckBookmarkLanguageLIBRARY finishing CheckBookmarkLanguageLIBRARY'
            )
          }
          if (typeof this.bookmark.library == 'undefined') {
            // console.log (route)
            response = await ContentService.getLibrary(route)
            value = response.data
            //console.log('BOOKMARK SERVICE --   library is ')
            //console.log(value)
            this.$store.dispatch('updateBookmark', ['library', value])
            console.log(
              'BOOKMARK SERVICE --CheckBookmarkLanguageLIBRARY finishing '
            )
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
      console.log('BOOKMARK SERVICE --CheckBookmarkBook    checking BOOK')
      if (!route.bookNAME) {
        console.log('BOOKMARK SERVICE --CheckBookmarkBook   UNSET  BOOK')
        //commit('UNSET_BOOKMARK', ['book'])
        return null
      }
      if (route.bookNAME) {
        try {
          var currentBook = ''
          if (typeof this.bookmark.book != 'undefined') {
            if (typeof this.bookmark.book.series != 'undefined') {
              currentBook = this.bookmark.series.book
            }
          }
          var value = {}
          if (route.book != currentBook) {
            var library = this.bookmark.library
            var length = library.length
            for (var i = 0; i < length; i++) {
              if (library[i].book == route.bookNAME) {
                console.log(
                  'BOOKMARK SERVICE --CheckBookmarkBook    I found book in library'
                )
                console.log(library[i])
                value = library[i]
              }
            }
            console.log(
              'BOOKMARK SERVICE --CheckBookmarkBook    updating bookmark BOOK with'
            )
            console.log(value)
            this.$store.dispatch('updateBookmark', ['book', value])
          }
          console.log(
            'BOOKMARK SERVICE --CheckBookmarkBook    FINISHING  with '
          )
          console.log(this.bookmark)
          return this.bookmark
        } catch (error) {
          console.log(
            'BOOKMARK SERVICE --CheckBookmarkBook There was an error in CheckBookmarkBook',
            error
          ) //
        }
      }
    },
    /* Series
          if route.book is not the same as bookmark 
          update book and erase all bookmark below*/
    async CheckBookmarkSeries(route) {
      console.log('BOOKMARK SERVICE --CheckBookmarkSeries')
      //    console.log(route)
      if (!route.bookNAME) {
        console.log('BOOKMARK SERVICE --CheckBookmarkSeries   NO SERIES ')
        return null
      }
      if (route.bookNAME) {
        try {
          var currentSeries = ''
          if (typeof this.bookmark.series.book != 'undefined') {
            currentSeries = this.bookmark.series.book
          }
          if (route.bookNAME != currentSeries) {
            // get folder and index from Library so you can get correct series
            console.log('BOOKMARK SERVICE --CheckBookmarkSeries    new series')

            route.folderNAME = this.bookmark.book.folder
            route.fileFILENAME = this.bookmark.book.index
            var response = await ContentService.getSeries(route)
            console.log(
              'BOOKMARK SERVICE  --CheckBookmarkSeries data returned from Content Service'
            )
            console.log(response)
            var value = response.data.content
            console.log(
              'BOOKMARK SERVICE  --CheckBookmarkSeries updating bookmark with SERIES value'
            )
            console.log(value)
            this.$store.dispatch('updateBookmark', ['series', value])
          }
          console.log('BOOKMARK SERVICE --CheckBookmarkSeries    FINISHING ')
          return this.bookmark
        } catch (error) {
          console.log(
            'BOOKMARK SERVICE --CheckBookmarkSeries There was an error in CheckBookmarkSeries',
            error
          ) //
        }
      }
    },
    /* Page
            if route.page is not the same as bookmark 
            update book and erase all bookmark below*/
    async CheckBookmarkPage(route) {
      if (!route.page) {
        //commit('UNSET_BOOKMARK', ['page'])
        console.log('BOOKMARK SERVICE --   UNSET PAGE')
        return null
      }
      if (route.page) {
        try {
          var value = {}
          var currentPage = ''
          if (typeof this.bookmark.page != 'undefined') {
            currentPage = this.bookmark.page
          }
          if (route.page != currentPage) {
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
                  if (chapters[i].filename == route.page) {
                    value = chapters[i]
                  }
                }
              } else {
                value = this.bookmark.book
              }
              // console.log ('value for page')
              //  console.log (value)
              console.log(
                'BOOKMARK SERVICE --CheckBookmarkPage    updating bookmark with PAGE value'
              )
              console.log(value)
              this.$store.dispatch('updateBookmark', ['page', value])
            } else {
              // it is a basic page from the library
              console.log(
                'BOOKMARK SERVICE --CheckBookmarkPage    This is a basic page'
              )
              value = {}
              value.title = ''
              // commit('SET_BOOKMARK', ['page', value])
            }
          }
          console.log(
            'BOOKMARK SERVICE --CheckBookmarkPage    FINISHING CheckBookmarkPage'
          )
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
