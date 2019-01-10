import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    country: {id: "ES"},
    language: {id: "eng"},
    library:{},
    book:{},

  },
  mutations: {},
  actions: {}
});
