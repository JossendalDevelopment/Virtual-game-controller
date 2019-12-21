import Vue from "vue";
import firebase from "firebase/app";
import "firebase/analytics";
import App from "./App.vue";
import store from "./store";

import KeyMappingsPlugin from "@/plugins/bindings";

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
});
firebase.analytics();

Vue.use(KeyMappingsPlugin);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
