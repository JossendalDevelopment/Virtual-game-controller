import store from "@/store/index.js";

export default {
  install(Vue) {
    Vue.mixin({
      computed: {
        $bindings() {
          let bindings = store.getters["mappings/mappings"];
          bindings.getUserKeybindings = () => {
            return store.dispatch("mappings/getKeyBindings", {});
          };
          bindings.setUserKeybindings = bindings => {
            return store.dispatch("mappings/setKeyBindings", {
              bindings
            });
          };
          return bindings;
        }
      }
    });
  }
};
