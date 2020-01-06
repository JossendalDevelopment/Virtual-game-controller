<template>
  <div>
    <Resizeable
      v-for="(button, index) of $bindings.userBindings"
      :key="index"
      :editing="$theme.editingState"
      :buttonData="button"
      :buttonIndex="index"
      :selected="currentButton.id === button.id"
      @drag-end="event => setButtonDimensions(event)"
      @pressed="event => handleClick(event)"
    >
      <!-- <Rocker v-if="button.type=='rocker'" :data="button" slot="content" /> -->
      <VirtualButton :data="button" slot="content" />
      <img
        v-if="$theme.editingState"
        slot="top-right-icon"
        style="position: absolute; cursor: pointer; z-index: 301; top: 5px; right: 5px; height: 18%; width: 18%;"
        src="@/assets/gear-option.svg"
        @click="showButtonSettings(button)"
      />
    </Resizeable>
    <Resizeable
      v-if="showModal"
      :buttonIndex="this.$bindings.userBindings.length"
      :editing="$theme.editingState"
    >
      <ButtonSettingsModal
        slot="content"
        :showModal="showModal"
        :data="currentButton"
        @set-binding="button => setBindingForButton(button)"
        @close="
          showModal = false;
          currentButton = {};
        "
        @delete="button => deleteButton(button)"
        @change="button => setButtonDimensions(button)"
      />
    </Resizeable>
  </div>
</template>

<script>
import io from "socket.io-client";

import ToHex from "../toHex.json";

// import Rocker from "./components/buttons/Rocker.vue";
import Resizeable from "../components/Resizeable.vue";
import VirtualButton from "../components/VirtualButton.vue";
import ButtonSettingsModal from "../components/ButtonSettingsModal.vue";

export default {
  name: "CustomTab",
  components: {
    // Rocker,
    Resizeable,
    VirtualButton,
    ButtonSettingsModal
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      socket: null,
      keyListeners: null,
      toHex: ToHex,
      showModal: false,
      currentButton: {}
    };
  },
  async mounted() {
    // TODO make this host ip configurable
    this.socket = io(`http://192.168.50.148:${5000}`);

    this.socket.on("connection", () => {
      console.log("Connection established");
      this.socket.on("disconnect", () => {
        console.log("Connection terminated");
      });
    });

    this.socket.on("error", error => console.log("Connection error:", error));

    this.socket.on("keypress-response", response => {
      console.log("keypress repsonse received", response);
      if (response.status === 500) {
        // TODO show an error popup
        console.error("Error in keypress response", response);
      }
    });
    this.keyListeners = e => {
      // console.log("KEY", e);
      this.currentButton = {
        ...this.currentButton,
        key: [this.toHex[e.key]],
        keyCode: e.keyCode,
        location: e.location // ex. 1 is left alt, 2 is right alt, 0 is non-positional
      };
      this.$bindings.update(this.currentButton);
      this.removeListeners();
      // this.socket.emit("keypress", e);
    };
  },
  destroy() {
    this.removeListeners();
  },
  methods: {
    showButtonSettings(button) {
      this.currentButton = button;
      this.showModal = true;
    },
    setBindingForButton() {
      this.addListeners();
    },
    addListeners() {
      window.addEventListener("keyup", this.keyListeners);
    },
    removeListeners() {
      window.removeEventListener("keyup", this.keyListeners);
    },
    handleClick(e) {
      // TODO design this to handle a down and up keypress
      this.socket.emit("keypress", e);
    },
    deleteButton(button) {
      const index = this.$bindings.userBindings.findIndex(
        item => item.id == button.id
      );
      const newKeyMappings = this.$bindings.userBindings.splice(index, 1);

      this.$bindings.setUserKeybindings(newKeyMappings);
      this.showModal = false;
    },
    setButtonDimensions(event) {
      this.$bindings.update(event);

      this.$bindings.setUserKeybindings(this.$bindings.userBindings);
    }
  }
};
</script>

<style></style>
