import Vue from 'vue'
import Router from 'vue-router'
import Countries from './views/Countries.vue'
import CountriesEdit from './views/CountriesEdit.vue'
import CountriesPreview from './views/CountriesPreview.vue'

import Language from './views/Languages.vue'
import LanguageEdit from './views/LanguagesEdit.vue'
import LanguagesPreview from './views/LanguagesPreview.vue'

import Library from './views/Library.vue'
import LibraryEdit from './views/LibraryEdit.vue'
import LibraryPreview from './views/LibraryPreview.vue'

import Series from './views/Series.vue'
import SeriesEdit from './views/SeriesEdit.vue'
import SeriesPreview from './views/SeriesPreview.vue'

import Page from './views/Page.vue'
import PageEdit from './views/PageEdit.vue'
import PagePreview from './views/PagePreview.vue'

import Hello from './views/CKEditor4.vue'
import Users from './views/Users.vue'
import Members from './views/Members.vue'
import MembersAdd from './views/MembersAdd.vue'
import MembersUpdate from './views/MembersUpdate.vue'

import NotFoundComponent from './views/NotFound.vue'
import Menu from './components/NavDropdown.vue'
import Cat from './components/NavCat.vue'

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
      path: '/page/:countryCODE/:languageISO/:bookNAME/:pageFILENAME',
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
      path: '/edit/page/:countryCODE/:languageISO/:bookNAME/:pageFILENAME',
      name: 'editPage',
      component: PageEdit,
      props: true
    },
    {
      path: '/preview/countries',
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
      path: '/preview/page/:countryCODE/:languageISO/:bookNAME/:pageFILENAME',
      name: 'previewPage',
      component: PagePreview,
      props: true
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
      props: true
    },
    {
      path: '/cat',
      name: 'cat',
      component: Cat,
      props: true
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      props: true
    },
    {
      path: '/members',
      name: 'members',
      component: Members,
      props: true
    },
    {
      path: '/add',
      name: 'add',
      component: MembersAdd,
      props: true
    },
    {
      path: '/update',
      name: 'update',
      component: MembersUpdate,
      props: true
    },

    {
      path: '/hello',
      name: 'hello',
      component: Hello,
      props: true
    },
    {
      path: '*',
      component: NotFoundComponent
    }
  ]
})
