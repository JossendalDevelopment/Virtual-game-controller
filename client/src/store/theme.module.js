export const theme = {
  namespaced: true,
  state: {
    color: "green",
    editingState: false
  },
  getters: {
    theme: state => {
      return state;
    }
  },
  mutations: {
    setTheme(state, payload) {
      state.color = payload;
    },
    setEditingState(state, payload) {
      state.editingState = payload;
    }
  },
  actions: {
    setTheme({ commit }, payload) {
      commit("setTheme", payload);
    },
    setEditingState({ commit }, payload) {
      commit("setEditingState", payload);
    }
  }
};
