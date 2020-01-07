import api from "../services/api.service";

export const settings = {
  namespaced: true,
  state: {
    color: "green",
    editingState: false,
    clientIP: "0.0.0.0"
  },
  getters: {
    settings: state => {
      return state;
    }
  },
  mutations: {
    setTheme(state, payload) {
      state.color = payload;
    },
    setEditingState(state, payload) {
      state.editingState = payload;
    },
    setClientIP(state, payload) {
      state.clientIP = payload;
    }
  },
  actions: {
    setTheme({ commit }, payload) {
      commit("setTheme", payload);
    },
    setEditingState({ commit }, payload) {
      commit("setEditingState", payload);
    },
    setClientIP({ commit }, payload) {
      commit("setClientIP", payload);
    },
    async getClientIP({ commit }) {
      try {
        const clientIP = await api.getClientIP();
        commit("setClientIP", clientIP.data);
      } catch (error) {
        console.log("Error fetching local ip from server", error);
      }
    }
  }
};
