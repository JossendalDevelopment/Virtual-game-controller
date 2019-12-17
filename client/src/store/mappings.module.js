import axios from "axios";
// TODO implement default axios instance service

export const mappings = {
  namespaced: true,
  state: {
    userBindings: []
  },
  getters: {
    mappings: state => {
      return state;
    }
  },
  mutations: {
    setUserBindings(state, payload) {
      state.userBindings = payload;
    },
    getUserBindings(state) {
      return state.userBindings;
    },
    updateBinding(state, payload) {
      const index = state.userBindings.findIndex(
        b => b.id === payload.newBinding.id
      );
      state.userBindings[index] = payload.newBinding;
      console.log("UPDATED", state.userBindings);
    },
    addBinding(state) {
      state.userBindings = [
        ...state.userBindings,
        {
          buttonName: "W",
          id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
          key: "w",
          keyCode: 87,
          position: {
            width: 150,
            height: 100,
            top: 100,
            left: 100
          },
          style: {
            background: "#e2e2e2"
          }
        }
      ];
    },
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    }
  },
  actions: {
    async getKeyBindings({ commit }) {
      try {
        const jsonData = await axios.get(
          `http://${process.env.VUE_APP_API_HOST}:5000/get_key_mapping`
        );
        const bindings = jsonData.data.keyMappings;
        commit("setUserBindings", bindings);
        return bindings;
      } catch (error) {
        console.log("Error in 'getKeyBindings action", error);
      }
    },
    async setKeyBindings({ commit }, payload) {
      try {
        await axios.post(
          `http://${process.env.VUE_APP_API_HOST}:5000/set_key_mapping`,
          payload.bindings
        );
        commit("setUserBindings", payload.bindings);
        return payload;
      } catch (error) {
        console.log("Error in 'setKeyBindings action", error);
      }
    },
    update({ commit }, payload) {
      commit("updateBinding", payload);
    },
    addBinding({ commit }) {
      commit("addBinding");
    },
    startLoading({ commit }) {
      commit("startLoading");
    },
    stopLoading({ commit }) {
      commit("stopLoading");
    }
  }
};
