import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import KeyMappingsPlugin from "@/plugins/mappings";

Vue.config.productionTip = false;

Vue.use(KeyMappingsPlugin);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
