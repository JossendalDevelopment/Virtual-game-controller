import store from "@/store/index.js";

export default {
  install(Vue) {
    Vue.mixin({
      computed: {
        $settings() {
          let settings = store.getters["settings/settings"];
          settings.setTheme = newTheme => {
            return store.dispatch("settings/setTheme", newTheme);
          };
          settings.setEditingState = editingState => {
            return store.dispatch("settings/setEditingState", editingState);
          };
          settings.setClientIP = clientIP => {
            return store.dispatch("settings/setClientIP", clientIP);
          };
          settings.getClientIP = () => {
            return store.dispatch("settings/getClientIP");
          };
          return settings;
        }
      }
    });
  }
};
