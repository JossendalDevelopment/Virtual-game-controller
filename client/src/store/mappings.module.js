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
          "http://localhost:5000/get_key_mapping"
        );
        const bindings = jsonData.data.keyMappings;
        commit("setUserBindings", bindings);
        return bindings;
      } catch (error) {
        console.log("ERR", error);
      }
    },
    async setKeyBindings({ commit }, payload) {
      console.log("NEW BINDING", payload.bindings);
      const response = await axios.post(
        "http://localhost:5000/set_key_mapping",
        payload.bindings
      );
      console.log("F RESPONSE", response);
      commit("setUserBindings", payload);
      return payload;
    },
    startLoading({ commit }) {
      commit("startLoading");
    },
    stopLoading({ commit }) {
      commit("stopLoading");
    }
  }
};
