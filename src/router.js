import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Country from './views/Country.vue'
import Language from './views/Languages.vue'
import Library from './views/Library.vue'
import Series from './views/Series.vue'
import Topic from './views/Topic.vue'
import Feedback from './views/Feedback.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/country',
      name: 'countries',
      component: Country
    },
    {
      path: '/language',
      name: 'languages',
      component: Language
    },
    {
      path: '/library/:country/:language',
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
    }
  ]
})
