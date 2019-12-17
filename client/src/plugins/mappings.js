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
          bindings.update = newBinding => {
            return store.dispatch("mappings/update", {
              newBinding
            });
          };
          bindings.addBinding = () => {
            return store.dispatch("mappings/addBinding");
          };
          return bindings;
        }
      }
    });
  }
};
