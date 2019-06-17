import Vue from 'vue'
import Router from 'vue-router'
import Countries from './views/Countries.vue'
import CountriesEdit from './views/CountriesEdit.vue'
import CountriesPreview from './views/CountriesPreview.vue'
import CountriesSort from './views/CountriesSort.vue'

import CountryPageEdit from './views/CountryPageEdit.vue'
import CountryPagePreview from './views/CountryPagePreview.vue'

import Language from './views/Languages.vue'
import LanguageEdit from './views/LanguagesEdit.vue'
import LanguagesPreview from './views/LanguagesPreview.vue'
import LanguagesSort from './views/LanguagesSort.vue'

import Library from './views/Library.vue'
import LibraryEdit from './views/LibraryEdit.vue'
import LibraryPreview from './views/LibraryPreview.vue'
import LibrarySort from './views/LibrarySort.vue'

import Series from './views/Series.vue'
import SeriesEdit from './views/SeriesEdit.vue'
import SeriesPreview from './views/SeriesPreview.vue'
import SeriesSort from './views/SeriesSort.vue'

import Page from './views/Page.vue'
import PageEdit from './views/PageEdit.vue'
import PagePreview from './views/PagePreview.vue'

import Template from './views/Template.vue'

import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Custom from './views/CustomEditor.vue'
import Validate from './views/Validate.vue'
import Upload from './views/Upload.vue'
import Transfer from './views/Transfer.vue'

// for CKFinder

//edit.myfriends.network/preview

import NotFoundComponent from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    

    {
      path: '/',
      name: 'countries',
      component: Countries
    },
    {
      path: '/edit/country/:countryCODE',
      name: 'editCountryPage',
      component: CountryPageEdit
    },
    {
      path: '/preview/country/:countryCODE',
      name: 'previewCountryPage',
      component: CountryPagePreview
    },
    {
      path: '/farm',
      name: 'farm',
      component: Register,
      props: true
    },
    {
      path: '/languages/:countryCODE',
      name: 'languages',
      component: Language,
      props: true
    },
    {
      path: '/library/:countryCODE/:languageISO/:libraryCODE?',
      name: 'library',
      component: Library,
      props: true
    },
    {
      path: '/series/:countryCODE/:languageISO/:libraryCODE/:folderNAME',
      name: 'series',
      component: Series,
      props: true
    },
    {
      path: '/page/:countryCODE/:languageISO/:libraryCODE/:folderNAME/:fileNAME',
      name: 'page',
      component: Page,
      props: true
    },
    {
      path: '/edit/countries',
      name: 'editCountries',
      component: CountriesEdit
    },
    {
      path: '/edit/languages/:countryCODE',
      name: 'editLanguages',
      component: LanguageEdit,
      props: true
    },
    {
      path: '/edit/library/:countryCODE/:languageISO/:libraryCODE?',
      name: 'editLibrary',
      component: LibraryEdit,
      props: true
    },
    {
      path: '/edit/series/:countryCODE/:languageISO/:libraryCODE/:folderNAME',
      name: 'editSeries',
      component: SeriesEdit,
      props: true
    },
    {
      path:
        '/edit/page/:countryCODE/:languageISO/:libraryCODE/:folderNAME/:fileNAME/:cssFORMATTED',
      name: 'editPage',
      component: PageEdit,
      props: true
    },
    {
      path: '/preview',
      name: 'previewCountries',
      component: CountriesPreview
    },
    {
      path: '/preview/languages/:countryCODE',
      name: 'previewLanguages',
      component: LanguagesPreview,
      props: true
    },
    {
      path: '/preview/library/:countryCODE/:languageISO/:libraryCODE?',
      name: 'previewLibrary',
      component: LibraryPreview,
      props: true
    },
    {
      path: '/preview/series/:countryCODE/:languageISO/:libraryCODE/:folderNAME',
      name: 'previewSeries',
      component: SeriesPreview,
      props: true
    },
    {
      path: '/preview/page/:countryCODE/:languageISO/:libraryCODE/:folderNAME/:fileNAME',
      name: 'previewPage',
      component: PagePreview,
      props: true
    },
    {
      path: '/sort/countries',
      name: 'sortCountries',
      component: CountriesSort
    },
    {
      path: '/sort/languages/:countryCODE',
      name: 'sortLanguages',
      component: LanguagesSort,
      props: true
    },
    {
      path: '/sort/library/:countryCODE/:languageISO/:libraryCODE/',
      name: 'sortLibrary',
      component: LibrarySort,
      props: true
    },
    {
      path: '/sort/series/:countryCODE/:languageISO/:libraryCODE/:folderNAME',
      name: 'sortSeries',
      component: SeriesSort,
      props: true
    },
    {
      path: '/template/:countryCODE/:languageISO',
      name: 'createTemplate',
      component: Template,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      props: false
    },
    {
      path: '/transfer/:countryCODE/:languageISO/:actionCODE',
      name: 'transfer',
      component: Transfer,
      props: false
    },

    {
      path: '/validate',
      name: 'validate',
      component: Validate,
      props: false
    },
    {
      path: '/custom/:css',
      name: 'custom',
      component: Custom,
      props: true
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload,
      props: true
    },
    {
      path: '*',
      component: NotFoundComponent
    }
  ]
})
