import Vue from 'vue'
import Router from 'vue-router'
import Countries from './views/Countries.vue'
import CountriesEdit from './views/CountriesEdit.vue'
import CountriesPreview from './views/CountriesPreview.vue'
import CountriesSort from './views/CountriesSort.vue'

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

import Users from './views/Users.vue'
import Custom from './views/CustomEditor.vue'
import Validate from './views/Validate.vue'
import Test from './views/Test.vue'

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
      path: '/languages/:countryCODE',
      name: 'languages',
      component: Language,
      props: true
    },
    {
      path: '/library/:countryCODE/:languageISO',
      name: 'library',
      component: Library,
      props: true
    },
    {
      path: '/series/:countryCODE/:languageISO/:bookNAME',
      name: 'series',
      component: Series,
      props: true
    },
    {
      path: '/page/:countryCODE/:languageISO/:bookNAME/:fileFILENAME',
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
      path: '/edit/language/:countryCODE',
      name: 'editLanguages',
      component: LanguageEdit,
      props: true
    },
    {
      path: '/edit/library/:countryCODE/:languageISO',
      name: 'editLibrary',
      component: LibraryEdit,
      props: true
    },
    {
      path: '/edit/series/:countryCODE/:languageISO/:bookNAME',
      name: 'editSeries',
      component: SeriesEdit,
      props: true
    },
    {
      path: '/edit/page/:countryCODE/:languageISO/:bookNAME/:fileFILENAME',
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
      path: '/preview/language/:countryCODE',
      name: 'previewLanguages',
      component: LanguagesPreview,
      props: true
    },
    {
      path: '/preview/library/:countryCODE/:languageISO',
      name: 'previewLibrary',
      component: LibraryPreview,
      props: true
    },
    {
      path: '/preview/series/:countryCODE/:languageISO/:bookNAME',
      name: 'previewSeries',
      component: SeriesPreview,
      props: true
    },
    {
      path: '/preview/page/:countryCODE/:languageISO/:bookNAME/:fileFILENAME',
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
      path: '/sort/language/:countryCODE',
      name: 'sortLanguages',
      component: LanguagesSort,
      props: true
    },
    {
      path: '/sort/library/:countryCODE/:languageISO',
      name: 'sortLibrary',
      component: LibrarySort,
      props: true
    },
    {
      path: '/sort/series/:countryCODE/:languageISO/:bookNAME',
      name: 'sortSeries',
      component: SeriesSort,
      props: true
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      props: true
    },
    {
      path: '/validate',
      name: 'validate',
      component: Validate,
      props: false
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      props: false
    },
    {
      path: '/custom',
      name: 'custom',
      component: Custom,
      props: true
    },

    {
      path: '*',
      component: NotFoundComponent
    }
  ]
})
