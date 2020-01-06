import store from "@/store/index.js";

export default {
  install(Vue) {
    Vue.mixin({
      computed: {
        $theme() {
          let theme = store.getters["theme/theme"];
          theme.setTheme = newTheme => {
            return store.dispatch("theme/setTheme", newTheme);
          };
          theme.setEditingState = editingState => {
            return store.dispatch("theme/setEditingState", editingState);
          };
          return theme;
        }
      }
    });
  }
};
