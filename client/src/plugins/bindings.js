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
          bindings.addBinding = filename => {
            return store.dispatch("mappings/addBinding", { filename });
          };
          bindings.duplicate = binding => {
            return store.dispatch("mappings/duplicateBinding", { binding });
          };
          return bindings;
        }
      }
    });
  }
};
