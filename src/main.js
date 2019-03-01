import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Vuelidate from 'vuelidate'
import './registerServiceWorker'

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

Vue.use(Vuelidate)

const requireComponent = require.context(
  './components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})
Vue.config.productionTip = false
Vue.prototype.$country = 'AU'
Vue.prototype.$language = 'eng'

var vm = new Vue({
  router,
  store,
  render: function(h) {
    return h(App)
  }
}).$mount('#app')
