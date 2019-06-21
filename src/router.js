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
      path: '/edit/country/:country_code',
      name: 'editCountryPage',
      component: CountryPageEdit
    },
    {
      path: '/preview/country/:country_code',
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
      path: '/languages/:country_code',
      name: 'languages',
      component: Language,
      props: true
    },
    {
      path: '/library/:country_code/:language_iso/:library_code?',
      name: 'library',
      component: Library,
      props: true
    },
    {
      path: '/series/:country_code/:language_iso/:library_code/:folder_name',
      name: 'series',
      component: Series,
      props: true
    },
    {
      path:
        '/page/:country_code/:language_iso/:library_code/:folder_name/:filename',
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
      path: '/edit/languages/:country_code',
      name: 'editLanguages',
      component: LanguageEdit,
      props: true
    },
    {
      path: '/edit/library/:country_code/:language_iso/:library_code?',
      name: 'editLibrary',
      component: LibraryEdit,
      props: true
    },
    {
      path:
        '/edit/series/:country_code/:language_iso/:library_code/:folder_name',
      name: 'editSeries',
      component: SeriesEdit,
      props: true
    },
    {
      path:
        '/edit/page/:country_code/:language_iso/:library_code/:folder_name/:filename/:cssFORMATTED',
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
      path: '/preview/languages/:country_code',
      name: 'previewLanguages',
      component: LanguagesPreview,
      props: true
    },
    {
      path: '/preview/library/:country_code/:language_iso/:library_code?',
      name: 'previewLibrary',
      component: LibraryPreview,
      props: true
    },
    {
      path:
        '/preview/series/:country_code/:language_iso/:library_code/:folder_name',
      name: 'previewSeries',
      component: SeriesPreview,
      props: true
    },
    {
      path:
        '/preview/page/:country_code/:language_iso/:library_code/:folder_name/:filename',
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
      path: '/sort/languages/:country_code',
      name: 'sortLanguages',
      component: LanguagesSort,
      props: true
    },
    {
      path: '/sort/library/:country_code/:language_iso/:library_code/',
      name: 'sortLibrary',
      component: LibrarySort,
      props: true
    },
    {
      path:
        '/sort/series/:country_code/:language_iso/:library_code/:folder_name',
      name: 'sortSeries',
      component: SeriesSort,
      props: true
    },
    {
      path: '/template/:country_code/:language_iso',
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
      path: '/transfer/:country_code/:language_iso/:actionCODE',
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
