import Vue from "vue";
import Vuex from "vuex";

import { mappings } from "./mappings.module";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    // add vuex-persist
  ],
  modules: {
    mappings
  }
});
