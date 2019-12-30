import axios from "axios";
import api from "../services/api.service";
import { getWidgetImageUrl } from "../utils";
import { Binding } from "../types/binding";

export const mappings = {
  namespaced: true,
  state: {
    userBindings: [],
    loading: false
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
    },
    duplicateBinding(state, payload) {
      const shifted = {
        ...payload,
        id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        position: {
          ...payload.position,
          left: payload.position.left + 20
        }
      };
      const newBinding = new Binding(shifted);
      state.userBindings = [...state.userBindings, newBinding];
    },
    async addBinding(state, filename) {
      let fileuri = undefined;
      if (filename) {
        fileuri = await getWidgetImageUrl(filename);
      }
      const newBinding = new Binding({
        image: filename || undefined,
        imageUrl: fileuri
      });
      console.log("NEW BINDING", newBinding);
      state.userBindings = [...state.userBindings, newBinding];
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
        const widgets = await api.loadWidgets();
        commit("setUserBindings", widgets);
        return widgets;
      } catch (error) {
        console.log("Error in 'getKeyBindings action", error);
      }
    },
    async setKeyBindings({ commit }, payload) {
      // TODO move to api service
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
    addBinding({ commit }, payload) {
      commit("addBinding", payload.filename);
    },
    duplicateBinding({ commit }, payload) {
      commit("duplicateBinding", payload.binding);
    },
    startLoading({ commit }) {
      commit("startLoading");
    },
    stopLoading({ commit }) {
      commit("stopLoading");
    }
  }
};
