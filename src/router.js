import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Countries from './views/Countries.vue'
import Country from './components/Country.vue'
import Language from './views/Languages.vue'
import Library from './views/Library.vue'
import Series from './views/Series.vue'
import Topic from './views/Topic.vue'
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
      path: '/languages/:country/',
      name: 'languages',
      component: Language,
      props: true
    },
    {
      path: '/library/:country/:folder',
      name: 'library',
      component: Library,
      props: true
    },
    {
      path: '/series/:folder/:series/',
      name: 'series',
      component: Series,
      props: true
    },
    {
      path: '/topic/:folder/:series/:topic',
      name: 'topic',
      component: Topic,
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
