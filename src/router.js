import Vue from 'vue'
import Router from 'vue-router'
import Countries from './views/Countries.vue'
import Language from './views/Languages.vue'
import Library from './views/Library.vue'
import Series from './views/Series.vue'
import Page from './views/Page.vue'
import Feedback from './views/Feedback.vue'
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
path: '/languages/:countryCODE/',
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
path: '/series/:countryCODE/:languageISO/:bookNAME/',
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
path: '/feedback',
name: 'Feedback',
component: Feedback
},

{
path: '*',
component: NotFoundComponent
}
]
})
